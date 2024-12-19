import { db } from '../index.js';
import { playersTable, promptsTable, battlesTable } from '../schema.js';
import { eq } from 'drizzle-orm';

export async function deletePlayer(id: string) {
  const [deletedPlayer] = await db.delete(playersTable)
    .where(eq(playersTable.id, id))
    .returning();
  return deletedPlayer;
}

export async function deletePrompt(id: string) {
  const [deletedPrompt] = await db.delete(promptsTable)
    .where(eq(promptsTable.id, id))
    .returning();
  return deletedPrompt;
}

export async function deleteBattle(id: string) {
  const [deletedBattle] = await db.delete(battlesTable)
    .where(eq(battlesTable.id, id))
    .returning();
  return deletedBattle;
} 