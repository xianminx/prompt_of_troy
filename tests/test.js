import { PlayerService, BattleService, PromptService } from '../src/domain/index.js';

// Update PlayerService to use singleton
const playerService = PlayerService.getInstance();
const battleService = BattleService.getInstance();
const promptService = PromptService.getInstance();

// Before running tests
PlayerService.resetInstance();
BattleService.resetInstance();
PromptService.resetInstance();

const player = await playerService.getById('player1');
console.log(player);

// const battle = await battleService.getById('battle1');
// console.log(battle);

// const prompt = await promptService.getById('prompt1');
// console.log(prompt);
