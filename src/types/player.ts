export type SortDirection = 'asc' | 'desc';
export type SortableFields = 'rating' | 'createdAt' | 'name';

export interface PlayerQuery {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: SortableFields;
        direction: SortDirection;
    };
    count?: boolean;
} 