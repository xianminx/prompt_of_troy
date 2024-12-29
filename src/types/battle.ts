export type BattleStatus = 'pending' | 'running' | 'completed' | 'error';

export type BattleSortableFields = 'createdAt' | 'status' | 'completedAt' | 'startedAt';
export type SortDirection = 'asc' | 'desc';

export interface BattleQuery {
    limit?: number;
    offset?: number;
    status?: BattleStatus;
    createdBy?: string;
    orderBy?: {
        field: BattleSortableFields;
        direction: SortDirection;
    };
    count?: boolean;
}

export interface RatingChanges {
    attacker: number;
    defender: number;
} 
