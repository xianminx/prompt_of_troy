import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file
const envFileName = `.env.${process.env.NODE_ENV || 'dev'}`;
const envFile = path.resolve(process.cwd(), envFileName);

console.log(`Loading environment file: ${envFile}`);
dotenv.config({ path: envFile });

export const config = {
    supabase: {
        db: process.env.POSTGRES_URL,
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
        serviceRole: process.env.SUPABASE_SERVICE_ROLE,
    },
    isProduction: process.env.NODE_ENV === 'prod',
    isDevelopment: process.env.NODE_ENV === 'dev',
}; 