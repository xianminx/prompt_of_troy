
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import dotenv from 'dotenv';

dotenv.config({ path: '.env.prod' }); // or .env.local

const connectionString = process.env.DATABASE_URL as string

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);

export * from './schema.js';
export * from './queries/insert.js';
export * from './queries/update.js';
export * from './queries/delete.js';
export * from './queries/select.js';
export * from './battles.js';