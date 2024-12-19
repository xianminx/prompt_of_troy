import { PlayerService, BattleService, PromptService } from '../src/domain/index.js';

const playerService = new PlayerService();
const battleService = new BattleService();
const promptService = new PromptService();

const player = await playerService.getById('player1');
console.log(player);

// const battle = await battleService.getById('battle1');
// console.log(battle);

// const prompt = await promptService.getById('prompt1');
// console.log(prompt);
