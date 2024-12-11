import { battlesDb } from '../../db/battles.js';
import { PromptService } from '../prompts/service.js';
import { PlayerService } from '../players/index.js';
import OpenAI from 'openai';
import { Battle, BATTLE_STATUS } from './battle.js';

const MODEL = "gpt-4o-mini";
const ELO_K = 32;
const MAX_RATING_CHANGE = 50;

export class BattleService {
    constructor() {
        this.promptService = new PromptService();
        this.playerService = new PlayerService();
        this.openai = new OpenAI();
    }

    async getById(id) {
        const battleData = await battlesDb.getById(id);
        return battleData ? new Battle(battleData) : null;
    }

    async create(attackPromptId, defendPromptId) {
        // Validate prompts exist and have correct types
        const [attackPrompt, defendPrompt] = await Promise.all([
            this.promptService.getById(attackPromptId),
            this.promptService.getById(defendPromptId)
        ]);

        if (!attackPrompt || !defendPrompt) {
            throw new Error("Invalid prompts - one or both prompts not found");
        }

        if (attackPrompt.type !== "attack") {
            throw new Error("First prompt must be an attack prompt");
        }

        if (defendPrompt.type !== "defend") {
            throw new Error("Second prompt must be a defense prompt");
        }

        // Ensure both players exist
        const [attacker, defender] = await Promise.all([
            this.playerService.getById(attackPrompt.userId),
            this.playerService.getById(defendPrompt.userId)
        ]);

        if (!attacker) {
            await this.playerService.create(attackPrompt.userId, `Player_${attackPrompt.userId}`);
        }

        if (!defender) {
            await this.playerService.create(defendPrompt.userId, `Player_${defendPrompt.userId}`);
        }

        const battle = Battle.create({
            attackPromptId,
            defendPromptId,
            attackerId: attackPrompt.userId,
            defenderId: defendPrompt.userId
        });

        await battlesDb.create(battle);
        return battle;
    }

    async runBattle(battleId) {
        const battle = await this.getById(battleId);
        if (!battle) {
            throw new Error(`Battle ${battleId} not found`);
        }

        if (battle.status !== BATTLE_STATUS.PENDING) {
            throw new Error(`Battle ${battleId} is already ${battle.status}`);
        }

        // Update battle status to running
        battle.setRunning();
        await battlesDb.updateStatus(battle.id, {
            status: BATTLE_STATUS.RUNNING,
            startedAt: battle.startedAt
        });

        try {
            const [attackPrompt, defendPrompt] = await Promise.all([
                this.promptService.getById(battle.attackPromptId),
                this.promptService.getById(battle.defendPromptId)
            ]);

            const result = await this._executeBattle(attackPrompt, defendPrompt, battle.secret);
            
            // Update ratings
            const ratingChanges = await this._updateRatings(
                battle.attackerId, 
                battle.defenderId, 
                result.winner === "attack"
            );

            // Update battle with results
            battle.setComplete(result.winner, ratingChanges);
            
            await battlesDb.updateBattleResult(battle.id, {
                status: BATTLE_STATUS.COMPLETED,
                winner: result.winner,
                ratingChanges,
                completedAt: battle.completedAt
            });

            return battle;

        } catch (error) {
            battle.setError(error.message);
            await battlesDb.updateStatus(battle.id, {
                status: BATTLE_STATUS.ERROR,
                completedAt: battle.completedAt
            });
            throw error;
        }
    }

    async getAll(query) {
        const battles = await battlesDb.getAll(query);
        return battles.map((b) => new Battle(b));
    }

    async _executeBattle(attackPrompt, defendPrompt, secret) {
        const messages = [
            { 
                role: "system", 
                content: `Your secret is: ${secret}.\n\n${defendPrompt.content}` 
            },
            { 
                role: "user", 
                content: attackPrompt.content 
            }
        ];

        const response = await this.openai.chat.completions.create({
            messages,
            model: MODEL,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        const winner = content.toLowerCase().includes(secret.toLowerCase()) 
            ? "attack" 
            : "defend";

        return { winner, content };
    }

    async _updateRatings(attackerId, defenderId, attackerWon) {
        const [attacker, defender] = await Promise.all([
            this.playerService.getById(attackerId),
            this.playerService.getById(defenderId)
        ]);

        const expectedScore = this._calculateExpectedScore(
            attacker.rating,
            defender.rating
        );

        const actualScore = attackerWon ? 1 : 0;
        const attackerChange = this._calculateRatingChange(
            ELO_K,
            actualScore,
            expectedScore
        );
        const defenderChange = -attackerChange;

        await Promise.all([
            this.playerService.updateRating(attackerId, attacker.rating + attackerChange),
            this.playerService.updateRating(defenderId, defender.rating + defenderChange)
        ]);

        return {
            attacker: attackerChange,
            defender: defenderChange
        };
    }

    _calculateExpectedScore(ratingA, ratingB) {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    _calculateRatingChange(k, actual, expected) {
        const change = Math.round(k * (actual - expected));
        return Math.max(Math.min(change, MAX_RATING_CHANGE), -MAX_RATING_CHANGE);
    }
}