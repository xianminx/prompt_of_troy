import { db } from '../index.js';
import { playersTable, promptsTable, battlesTable } from '../schema.js';
import { eq } from 'drizzle-orm';
import { type InsertPlayer, type InsertPrompt, type InsertBattle } from '../schema.js';
export async function updatePlayer(id: string, updates: Partial<Omit<InsertPlayer, 'id'>>) {
  const [updatedPlayer] = await db.update(playersTable)
    .set(updates)
    .where(eq(playersTable.id, id))
    .returning();
  return updatedPlayer;
}

export async function updatePrompt(id: string, updates: Partial<Omit<InsertPrompt, 'id'>>) {
  const [updatedPrompt] = await db.update(promptsTable)
    .set(updates)
    .where(eq(promptsTable.id, id))
    .returning();
  return updatedPrompt;
}

export async function updateBattle(id: string, updates: Partial<Omit<InsertBattle, 'id'>>) {
  const [updatedBattle] = await db.update(battlesTable)
    .set(updates)
    .where(eq(battlesTable.id, id))
    .returning();
  return updatedBattle;
} 