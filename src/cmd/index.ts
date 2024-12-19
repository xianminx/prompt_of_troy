import { handlePromptCmd } from './promptCmd';
import { handleTestCmd } from './testCmd';
import { handleBattleCmd } from './battleCmd';
import { Request, Response } from 'express';
import { InteractionResponseType } from "discord-interactions";

const CMD = {
    TEST: "test",
    PROMPT: "prompt",
    BATTLE: "battle",
};

async function handleCommand(req: Request, res: Response) {
    const { name } = req.body.data;
    if (name === CMD.TEST) {
        await handleTestCmd(req, res);
        return;
    } else if (name === CMD.PROMPT) {
        await handlePromptCmd(req, res);
        return;
    } else if (name === CMD.BATTLE) {
        await handleBattleCmd(req, res);
        return;
    } else {
        // no valid command found
        console.log("No valid command found");
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "No valid command found" },
        });
    }
}


async function handleComponentInteraction(req: Request, res: Response) {
    const { custom_id } = req.body.data;
    if (custom_id === "attack") {
        await res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "Hello, world!" },
        });
    }
}


export { handleCommand, handleComponentInteraction };
export { BATTLE_COMMAND } from './battleCmd';
export { PROMPT_COMMAND } from './promptCmd';
export { TEST_COMMAND } from './testCmd';