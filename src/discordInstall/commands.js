import { InstallGlobalCommands } from './utils.js';
import { BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND } from '../cmd/index.js';
import { config } from '../config/index.js';
const ALL_COMMANDS = [BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
