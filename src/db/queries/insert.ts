import { db } from '../index.js';
import { playersTable, promptsTable, type InsertPlayer, type InsertPrompt, battlesTable, type InsertBattle } from '../schema.js';

export async function insertPlayer(player: InsertPlayer) {
  const [newPlayer] = await db.insert(playersTable)
    .values(player)
    .returning();
  return newPlayer;
}

export async function insertPrompt(prompt: InsertPrompt) {
  const [newPrompt] = await db.insert(promptsTable)
    .values(prompt)
    .returning();
  return newPrompt;
}

export async function insertManyPrompts(prompts: InsertPrompt[]) {
  const newPrompts = await db.insert(promptsTable)
    .values(prompts)
    .returning();
  return newPrompts;
}

export async function insertBattle(battle: InsertBattle) {
  const [newBattle] = await db.insert(battlesTable)
    .values(battle)
    .returning();
  return newBattle;
}
