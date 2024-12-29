import { eq, sql } from 'drizzle-orm';
import { db } from "./index";
import { promptsTable } from "./schema";
import { type PromptQuery } from '../types/prompt';

export async function findPrompts(query?: PromptQuery) {
    if (query?.count) {
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(promptsTable);
        return Number(result[0].count);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let baseQuery: any = db.select().from(promptsTable);

    if (query) {
        if (query.type) {
            baseQuery = baseQuery.where(eq(promptsTable.type, query.type));
        }

        if (query.createdBy) {
            baseQuery = baseQuery.where(eq(promptsTable.createdBy, query.createdBy));
        }

        if (query.codeName) {
            baseQuery = baseQuery.where(eq(promptsTable.codeName, query.codeName));
        }
        if (query.orderBy) {
            baseQuery = baseQuery.orderBy(
                sql`${promptsTable[query.orderBy.field]} ${sql.raw(query.orderBy.direction)}`
            );
        }

        if (query.orderBy) {
            baseQuery = baseQuery.orderBy(
                sql`${promptsTable[query.orderBy.field]} ${sql.raw(query.orderBy.direction)}`
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
