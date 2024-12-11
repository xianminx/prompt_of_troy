import { db } from './index.js';
import fs from 'fs/promises';
import path from 'path';

export async function setupDatabase() {
    try {
        // Read and execute schema
        const schemaPath = path.join(process.cwd(), 'src', 'db', 'sql', 'schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf-8');
        
        const { error: schemaError } = await db.rpc('run_sql', {
            sql_query: schema
        });

        if (schemaError) {
            throw schemaError;
        }

        // Run migrations
        const migrationsDir = path.join(process.cwd(), 'src', 'db', 'sql', 'migrations');
        const migrations = await fs.readdir(migrationsDir);
        
        // Sort migrations by filename to ensure order
        migrations.sort();

        async function hasExecutedMigration(migrationName) {
            const { data, error } = await db
                .from('schema_migrations')
                .select()
                .eq('migration_name', migrationName)
                .single();
            
            if (error && error.code !== 'PGRST116') { // Not found error
                throw error;
            }
            
            return !!data;
        }

        async function recordMigration(migrationName) {
            const { error } = await db
                .from('schema_migrations')
                .insert({ migration_name: migrationName });
            
            if (error) throw error;
        }

        for (const migration of migrations) {
            if (!migration.endsWith('.sql')) continue;
            
            console.log(`Running migration: ${migration}`);
            const migrationPath = path.join(migrationsDir, migration);
            const migrationSQL = await fs.readFile(migrationPath, 'utf-8');
            
            const { error } = await db.rpc('run_sql', {
                sql_query: migrationSQL
            });

            if (error) {
                throw new Error(`Migration ${migration} failed: ${error.message}`);
            }

            if (!await hasExecutedMigration(migration)) {
                await recordMigration(migration);
            }
        }

        console.log('Database setup completed successfully');
    } catch (err) {
        console.error('Failed to setup database:', err);
        throw err;
    }
} 