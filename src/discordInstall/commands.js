import { InstallGlobalCommands } from './utils.js';
import { BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND } from '../cmd/index.js';
// need to import config here to get the app id
import { config } from '../config/index.js';
const ALL_COMMANDS = [BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND];

console.log("config", config);
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
