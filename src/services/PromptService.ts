import { PlayerService } from "./PlayerService";
import { type SelectPrompt as Prompt, type SelectPlayer as Player, getPromptById, getAllPrompts, insertPrompt   , deletePrompt } from "../db/index";
import { generateCodeName } from "../utils/codeName";

interface PromptQuery {
    type?: 'attack' | 'defend';
    createdBy?: string;
    codeName?: string;
}

export class PromptService {
    private playerService: PlayerService;

    constructor() {
        this.playerService = new PlayerService();
    }

    async getById(id: string): Promise<Prompt | null> {
        return await getPromptById(id);
    }

    async getAll(queryString?: string): Promise<Prompt[]> {
        try {
            // Parse query string into structured query
            const query: PromptQuery = {};
            
            if (queryString) {
                // Handle user ID format: <@userId>
                if (queryString.startsWith('<@') && queryString.endsWith('>')) {
                    query.createdBy = queryString.slice(2, -1);
                }
                // Handle type queries
                else if (['attack', 'a'].includes(queryString.toLowerCase())) {
                    query.type = 'attack';
                }
                else if (['defend', 'd'].includes(queryString.toLowerCase())) {
                    query.type = 'defend';
                }
                // Handle combined format: <@userId>/type
                else if (queryString.includes('/')) {
                    const [userId, type, codeName] = queryString.split('/');
                    if (userId.startsWith('<@') && userId.endsWith('>')) {
                        query.createdBy = userId.slice(2, -1);
                    }
                    if (type) {
                        query.type = type.toLowerCase() === 'a' || type.toLowerCase() === 'attack' 
                            ? 'attack' 
                            : type.toLowerCase() === 'd' || type.toLowerCase() === 'defend'
                                ? 'defend'
                                : undefined;
                    }
                    if (codeName) {
                        query.codeName = codeName;
                    }
                }
            }

            const prompts = await getAllPrompts(query);
            return prompts;
        } catch (error) {
            console.error('Error getting prompts:', error);
            throw new Error('Failed to retrieve prompts');
        }
    }

    async create(userId: string, type: string, content: string): Promise<Prompt> {
        // Ensure user exists
        const player = await this.playerService.getById(userId);
        if (!player) {
            // Auto-create player if they don't exist
            await this.playerService.create(userId);
        }

        const codeName = generateCodeName(content);
        const prompt = await insertPrompt({
            id: crypto.randomUUID(),
            createdBy: userId,
            type,
            content,
            codeName,
            createdAt: new Date()
        });
        
        return prompt;
    }

    async delete(id: string): Promise<void> {
        await deletePrompt(id);
    }
} 