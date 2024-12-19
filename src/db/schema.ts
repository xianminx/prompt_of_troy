import { integer, pgTable, serial, text, timestamp, uuid, json } from 'drizzle-orm/pg-core';

export const playersTable = pgTable('players', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  rating: integer('rating').notNull().default(1000),
  wins: integer('wins').notNull().default(0),
  losses: integer('losses').notNull().default(0),
  draws: integer('draws').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export const promptsTable = pgTable('prompts', {
  id: text('id').primaryKey(),
  codeName: text('code_name').notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const battlesTable = pgTable('battles', {
  id: uuid('id').primaryKey().defaultRandom(),
  attackerId: text('attacker_id')
    .notNull()
    .references(() => playersTable.id),
  defenderId: text('defender_id')
    .notNull()
    .references(() => playersTable.id),
  attackPromptId: text('attack_prompt_id')
    .notNull()
    .references(() => promptsTable.id),
  defendPromptId: text('defend_prompt_id')
    .notNull()
    .references(() => promptsTable.id),
  status: text('status').notNull(),
  winner: text('winner'),
  secret: text('secret').notNull(),
  ratingChanges: json('rating_changes'),
  error: text('error'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertPlayer = typeof playersTable.$inferInsert;
export type SelectPlayer = typeof playersTable.$inferSelect;

export type InsertPrompt = typeof promptsTable.$inferInsert;
export type SelectPrompt = typeof promptsTable.$inferSelect;

export type InsertBattle = typeof battlesTable.$inferInsert;
export type SelectBattle = typeof battlesTable.$inferSelect;
