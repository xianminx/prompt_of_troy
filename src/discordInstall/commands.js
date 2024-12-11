import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';
import { BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND } from '../cmd/index.js';

const ALL_COMMANDS = [BATTLE_COMMAND, PROMPT_COMMAND, TEST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
