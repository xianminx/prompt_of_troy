import { eq, or } from "drizzle-orm";
import type { BattleQuery } from "../types/battle";
import { db } from "./index";
import { battlesTable } from "./schema";
import { sql } from "drizzle-orm";

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
    if (query?.count) {
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(battlesTable);
        return Number(result[0].count);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let baseQuery: any = db.select().from(battlesTable);

    if (query) {
        if (query.status) {
            baseQuery = baseQuery.where(eq(battlesTable.status, query.status));
        }

        if (query.orderBy) {
            baseQuery = baseQuery.orderBy(
                sql`${battlesTable[query.orderBy.field]} ${sql.raw(
                    query.orderBy.direction
                )}`
            );
        }

        if (query.limit) {
            baseQuery = baseQuery.limit(query.limit);
        }

        if (query.offset) {
            baseQuery = baseQuery.offset(query.offset);
        }

        if (query.participantId) {
            baseQuery = baseQuery.where(
                or(
                    eq(battlesTable.attackerId, query.participantId),
                    eq(battlesTable.defenderId, query.participantId)
                )
            );
        }
    }

    return await baseQuery;
}
