import { config } from '../src/config/index.js';
import { setupDatabase } from '../src/db/migrations.js';

async function main() {
    console.log(`Setting up database for ${config.isDevelopment ? 'development' : 'production'}`);
    
    try {
        await setupDatabase();
        console.log('Database setup complete');
    } catch (error) {
        console.error('Failed to setup database:', error);
        process.exit(1);
    }
}

main(); 