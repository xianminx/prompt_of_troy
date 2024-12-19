import { db } from '../src/db/superbase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
    try {
        console.log('Starting database seed...');
        
        // Read the seed SQL file
        const seedPath = path.join(__dirname, '../src/db/sql/seed.sql');
        const seedSQL = await fs.readFile(seedPath, 'utf8');
        
        // Split the SQL into individual statements
        const statements = seedSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);
            
        // Execute each statement
        for (const statement of statements) {
            const { error } = await db.rpc('exec_sql', {
                sql_string: statement
            });
            
            if (error) {
                throw error;
            }
        }
        
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed(); 