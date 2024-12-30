import { type SelectPrompt } from "../db/";

export type Prompt = SelectPrompt;

export type PromptType = 'attack' | 'defend';
export type PromptSortableFields = 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface PromptQuery {
    type?: PromptType;
    createdBy?: string;
    codeName?: string;
    limit?: number;
    offset?: number;
    count?: boolean;
    orderBy?: {
        field: PromptSortableFields;
        direction: SortDirection;
    };
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: PromptSortableFields;
    sortDirection?: SortDirection;
} 