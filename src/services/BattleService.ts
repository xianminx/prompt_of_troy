import OpenAI from "openai";

import { PromptService } from "./PromptService";
import { PlayerService } from "./PlayerService";
import {
    type SelectPrompt as Prompt,
    type SelectPlayer as Player,
    type SelectBattle as Battle,
    getPromptById,
    findBattles,
    getAllPrompts,
    insertPrompt,
    deletePrompt,
    getBattleById,
    insertBattle,
    getPlayerById,
    updateBattle,
} from "../db/index";
import { generateSecretKey } from "../utils/secretKeyGenerator";

const MODEL = "gpt-4o-mini";
const ELO_K = 32;
const MAX_RATING_CHANGE = 50;

export const BATTLE_STATUS = {
    PENDING: "pending",
    RUNNING: "running",
    COMPLETED: "completed",
    ERROR: "error",
};

export interface RatingChanges {
    attacker: number;
    defender: number;
}

interface BattleResult {
    winner: "attack" | "defend";
    content: string;
}

export interface BattleQuery {
    limit?: number;
    offset?: number;
    status?: (typeof BATTLE_STATUS)[keyof typeof BATTLE_STATUS];
    createdBy?: string;
}

export class BattleService {
    private promptService: PromptService;
    private playerService: PlayerService;
    private openai: OpenAI;

    constructor() {
        this.promptService = new PromptService();
        this.playerService = new PlayerService();
        this.openai = new OpenAI();
    }

    async getById(id: string): Promise<Battle | null> {
        return await getBattleById(id);
    }

    async create(
        attackPromptId: string,
        defendPromptId: string
    ): Promise<Battle> {
        // Validate prompts exist and have correct types
        const [attackPrompt, defendPrompt] = await Promise.all([
            getPromptById(attackPromptId),
            getPromptById(defendPromptId),
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
            getPlayerById(attackPrompt.createdBy),
            getPlayerById(defendPrompt.createdBy),
        ]);

        if (!attacker) {
            await this.playerService.create(
                attackPrompt.createdBy,
                `Player_${attackPrompt.createdBy}`
            );
        }

        if (!defender) {
            await this.playerService.create(
                defendPrompt.createdBy,
                `Player_${defendPrompt.createdBy}`
            );
        }

        const battle = {
            attackPromptId,
            defendPromptId,
            attackerId: attackPrompt.createdBy,
            defenderId: defendPrompt.createdBy,
            status: BATTLE_STATUS.PENDING,
            secret: generateSecretKey(),
        };

        const insertedBattle = await insertBattle(battle);

        return insertedBattle;
    }

    async runBattle(battleId: string): Promise<Battle> {
        const battle = await getBattleById(battleId);
        if (!battle) {
            throw new Error(`Battle ${battleId} not found`);
        }

        if (battle.status !== BATTLE_STATUS.PENDING) {
            throw new Error(`Battle ${battleId} is already ${battle.status}`);
        }

        // Update battle status to running
        battle.status = BATTLE_STATUS.RUNNING;
        battle.startedAt = new Date();
        await updateBattle(battle.id, {
            status: BATTLE_STATUS.RUNNING,
            startedAt: battle.startedAt,
        });

        try {
            const [attackPrompt, defendPrompt] = await Promise.all([
                this.promptService.getById(battle.attackPromptId),
                this.promptService.getById(battle.defendPromptId),
            ]);

            const result = await this._executeBattle(
                attackPrompt!,
                defendPrompt!,
                battle.secret
            );

            // Update ratings
            const ratingChanges = await this._updateRatings(
                battle.attackerId,
                battle.defenderId,
                result.winner === "attack"
            );

            battle.status = BATTLE_STATUS.COMPLETED;
            battle.winner = result.winner;
            battle.ratingChanges = ratingChanges;
            battle.completedAt = new Date();
            await updateBattle(battle.id, {
                status: BATTLE_STATUS.COMPLETED,
                winner: result.winner,
                ratingChanges,
                completedAt: battle.completedAt,
            });
            return battle;
        } catch (error) {
            battle.status = BATTLE_STATUS.ERROR;
            battle.error =
                error instanceof Error ? error.message : "Unknown error";
            await updateBattle(battle.id, {
                status: battle.status,
                error: battle.error,
                completedAt: battle.completedAt,
            });
            throw error;
        }
    }

    async getAll(query: BattleQuery): Promise<Battle[]> {
        const battles = await findBattles(query);
        return battles;
    }

    private async _executeBattle(
        attackPrompt: Prompt,
        defendPrompt: Prompt,
        secret: string
    ): Promise<BattleResult> {
        const messages = [
            {
                role: "system" as const,
                content: `Your secret is: ${secret}.\n\n${defendPrompt.content}`,
            },
            {
                role: "user" as const,
                content: attackPrompt.content,
            },
        ];

        const response = await this.openai.chat.completions.create({
            messages,
            model: MODEL,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No response content received from OpenAI");
        }

        const winner = content.toLowerCase().includes(secret.toLowerCase())
            ? "attack"
            : "defend";

        return { winner, content };
    }

    private async _updateRatings(
        attackerId: string,
        defenderId: string,
        attackerWon: boolean
    ): Promise<RatingChanges> {
        const [attacker, defender] = await Promise.all([
            this.playerService.getById(attackerId),
            this.playerService.getById(defenderId),
        ]);

        if (!attacker || !defender) {
            throw new Error("Players not found");
        }

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
            this.playerService.updateRating(
                attackerId,
                attacker.rating + attackerChange
            ),
            this.playerService.updateRating(
                defenderId,
                defender.rating + defenderChange
            ),
        ]);

        return {
            attacker: attackerChange,
            defender: defenderChange,
        };
    }

    private _calculateExpectedScore(ratingA: number, ratingB: number): number {
        return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
    }

    private _calculateRatingChange(
        k: number,
        actual: number,
        expected: number
    ): number {
        const change = Math.round(k * (actual - expected));
        return Math.max(
            Math.min(change, MAX_RATING_CHANGE),
            -MAX_RATING_CHANGE
        );
    }
}
