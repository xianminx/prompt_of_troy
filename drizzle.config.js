import { config } from './src/config/index';
import { defineConfig } from 'drizzle-kit';


export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.supabase.db,
  },
});
