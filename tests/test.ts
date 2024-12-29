import { insertPlayer, insertPrompt, getAllPlayers, getAllPrompts } from './index.js';

async function main() {
    await insertPlayer({ id: '34759235', name: 'John Doe'});
    await insertPrompt({ id: '34759235', codeName: 'beatiful_day', type: 'defense', content: 'What is the capital of France?', createdBy: '34759235' });


    const players = await getAllPlayers();
    const prompts = await getAllPrompts();

    console.log("players", players);
    console.log("prompts", prompts);
  }
  
  main();
  