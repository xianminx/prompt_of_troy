import { db } from '../index.js';
import { playersTable, promptsTable, battlesTable } from '../schema.js';
import { eq, desc, asc, sql, and } from 'drizzle-orm';

export async function getPlayerById(id: string) {
  const [player] = await db.select()
    .from(playersTable)
    .where(eq(playersTable.id, id));
  return player;
}

export async function getAllPlayers() {
  return db.select()
    .from(playersTable)
    .orderBy(desc(playersTable.rating));
}

export async function getPromptById(id: string) {
  const [prompt] = await db.select()
    .from(promptsTable)
    .where(eq(promptsTable.id, id));
  return prompt;
}

export async function getPromptsByType(type: string) {
  return db.select()
    .from(promptsTable)
    .where(eq(promptsTable.type, type));
}

interface PromptQuery {
    type?: 'attack' | 'defend';
    createdBy?: string;
    codeName?: string;
}

export async function getAllPrompts(query?: PromptQuery) {
    let baseQuery: any = db.select().from(promptsTable);

    if (query) {
        const conditions = [];
        
        if (query.type) {
            conditions.push(eq(promptsTable.type, query.type));
        }
        
        if (query.createdBy) {
            conditions.push(eq(promptsTable.createdBy, query.createdBy));
        }
        
        if (query.codeName) {
            conditions.push(eq(promptsTable.codeName, query.codeName));
        }

        if (conditions.length > 0) {
            baseQuery = baseQuery.where(and(...conditions));
        }
    }

    return baseQuery.orderBy(asc(promptsTable.createdAt));
}

export async function getBattleById(id: string) {
  const [battle] = await db.select()
    .from(battlesTable)
    .where(eq(battlesTable.id, id));
  return battle;
}

export async function getBattlesByPlayer(playerId: string) {
  return db.select()
    .from(battlesTable)
    .where(
      sql`${battlesTable.attackerId} = ${playerId} OR ${battlesTable.defenderId} = ${playerId}`
    )
    .orderBy(desc(battlesTable.createdAt));
}

export async function getBattlesByStatus(status: string) {
  return db.select()
    .from(battlesTable)
    .where(eq(battlesTable.status, status))
    .orderBy(desc(battlesTable.createdAt));
}

export async function getAllBattles() {
  return db.select()
    .from(battlesTable)
    .orderBy(desc(battlesTable.createdAt));
}


