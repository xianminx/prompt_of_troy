import { type SelectPrompt } from "../db/";

export type Prompt = SelectPrompt;

export type SortableFields = 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface PromptQuery {
    type?: 'attack' | 'defend';
    createdBy?: string;
    codeName?: string;
    limit?: number;
    offset?: number;
    count?: boolean;
    orderBy?: {
        field: SortableFields;
        direction: SortDirection;
    };
}

export interface PaginatedPrompts {
    prompts: Prompt[];
    total: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: SortableFields;
    sortDirection?: SortDirection;
} 