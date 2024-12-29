import { sql } from 'drizzle-orm';
import { db } from "./index";
import { playersTable } from "./schema";
import type { PlayerQuery } from '../types/player';

export async function findPlayers(query?: PlayerQuery) {
    if (query?.count) {
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(playersTable);
        return Number(result[0].count);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let baseQuery: any = db.select().from(playersTable);

    if (query) {
        if (query.orderBy) {
            baseQuery = baseQuery.orderBy(
                sql`${playersTable[query.orderBy.field]} ${sql.raw(query.orderBy.direction)}`
            );
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