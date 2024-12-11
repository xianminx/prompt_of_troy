import { promptsDb } from "../../db/prompts.js";
import { generateCodeName } from "../../utils/codeName.js";
import { Prompt } from "./prompt.js";
import { PlayerService } from "../players/index.js";

export class PromptService {
    constructor() {
        this.playerService = new PlayerService();
    }

    async getById(id) {
        const promptData = await promptsDb.getById(id);
        return promptData ? new Prompt(promptData) : null;
    }

    async getAll(query) {
        try {
            const prompts = await promptsDb.getAll(query);
            return prompts.map((p) => new Prompt(p));
        } catch (error) {
            console.error('Error getting prompts:', error);
            throw new Error('Failed to retrieve prompts');
        }
    }

    async create(userId, type, content) {
        // Ensure user exists
        const player = await this.playerService.getById(userId);
        if (!player) {
            // Auto-create player if they don't exist
            await this.playerService.create(userId, `Player_${userId}`);
        }

        const codeName = generateCodeName(content);
        const prompt = Prompt.create(userId, type, content, codeName);
        await promptsDb.create(prompt);
        return prompt;
    }

    async delete(id) {
        await promptsDb.delete(id);
    }
}
