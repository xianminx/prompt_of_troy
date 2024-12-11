import { setupDatabase } from './db/migrations.js';

async function init() {
    await setupDatabase();
    // rest of your app initialization
}

init().catch(console.error); 