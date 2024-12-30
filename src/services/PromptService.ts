import { type Prompt, type PromptSortableFields, type SortDirection, PromptQuery, PromptType } from "../types/prompt";
import { deletePrompt, findPrompts, getPromptById, insertPrompt } from "../db/index";
import { generateCodeName } from "../utils/codeName";
import { PlayerService } from "./PlayerService";
import { PaginatedResponse } from "@/types";

export class PromptService {
    private static instance: PromptService | null = null;
    private playerService: PlayerService;

    private constructor() {
        this.playerService = PlayerService.getInstance();
    }

    public static getInstance(): PromptService {
        if (!PromptService.instance) {
            PromptService.instance = new PromptService();
        }
        return PromptService.instance;
    }

    public static resetInstance(): void {
        PromptService.instance = null;
    }

    async getById(id: string): Promise<Prompt | null> {
        return getPromptById(id);
    }

    async getAll(query?: PromptQuery): Promise<Prompt[]> {
        return findPrompts(query);
    }

    async getPaginated(
        page: number = 1, 
        limit: number = 10,
        sortBy: PromptSortableFields = 'createdAt',
        sortDirection: SortDirection = 'desc',
        createdBy?: string,
        codeName?: string,
        type?: PromptType
    ): Promise<PaginatedResponse<Prompt>> {
        try {
            const query: PromptQuery = {
                limit,
                offset: (page - 1) * limit,
                orderBy: {
                    field: sortBy,
                    direction: sortDirection
                }
            };

            // Add optional filters if they exist
            if (createdBy) query.createdBy = createdBy;
            if (codeName) query.codeName = codeName;
            if (type) query.type = type;
            
            // Run both queries in parallel using Promise.all
            const [prompts, total] = await Promise.all([
                findPrompts(query),
                findPrompts({ count: true })
            ]);

        const totalPages = Math.ceil(total / limit);

        return {
            items: prompts,
            total,
            page,
            limit,
            totalPages,
            hasMore: page < totalPages,
        };
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