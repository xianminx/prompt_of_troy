import { type SelectBattle } from "../db/";

export type Battle = SelectBattle;

export type BattleStatus = "pending" | "running" | "completed" | "error";

export type BattleSortableFields =
    | "createdAt"
    | "status"
    | "completedAt"
    | "startedAt";
export type SortDirection = "asc" | "desc";

export interface BattleQuery {
    limit?: number;
    offset?: number;
    status?: BattleStatus;
    createdBy?: string;
    participantId?: string;
    orderBy?: {
        field: BattleSortableFields;
        direction: SortDirection;
    };

    count?: boolean;
}

export interface RatingChanges {
    attacker: {
        before: number;
        after: number;
        change: number;
    };
    defender: {
        before: number;
        after: number;
        change: number;
    };
}
