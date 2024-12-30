import { type SelectPlayer } from "../db/";

export type Player = SelectPlayer;

export type SortDirection = 'asc' | 'desc';
export type PlayerSortableFields = 'rating' | 'createdAt' | 'name';

export interface PlayerQuery {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: PlayerSortableFields;
        direction: SortDirection;
    };
    count?: boolean;
} 