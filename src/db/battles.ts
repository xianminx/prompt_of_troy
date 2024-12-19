import { db } from "./index";
import { battlesTable } from "./schema";
import { eq } from "drizzle-orm";
import type { BattleQuery } from "../services/BattleService";

export async function updateStatus(
    id: string,
    updates: {
        status: string;
        startedAt?: Date | null;
        completedAt?: Date | null;
    }
) {
    return await db
        .update(battlesTable)
        .set(updates)
        .where(eq(battlesTable.id, id))
        .returning();
}

export async function updateBattleResult(
    id: string,
    updates: {
        status: string;
        winner: string;
        ratingChanges: unknown;
        completedAt: Date;
    }
) {
    return await db
        .update(battlesTable)
        .set(updates)
        .where(eq(battlesTable.id, id))
        .returning();
}

export async function findBattles(query?: BattleQuery) {
    let baseQuery: any = db.select().from(battlesTable);
    if (query) {
        if (query.status) {
            baseQuery = baseQuery.where(eq(battlesTable.status, query.status));
        }

        if (query.limit) {
            baseQuery = baseQuery.limit(query.limit);
        }

        if (query.offset) {
            baseQuery = baseQuery.offset(query.offset);
        }
    }

    return await baseQuery;
}
