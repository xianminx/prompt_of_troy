import { handlePromptCmd } from './promptCmd';
import { handleTestCmd } from './testCmd';
import { handleBattleCmd } from './battleCmd';
import { InteractionResponseType, InteractionResponseFlags } from "discord-interactions";
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const CMD = {
    TEST: "test",
    PROMPT: "prompt",
    BATTLE: "battle",
};

async function handleCommand(req: NextRequest) {
    // Parse the JSON body since NextRequest doesn't do it automatically
    const body = await req.json();
    const { name } = body.data;

    if (name === CMD.TEST) {
        return await handleTestCmd(req);
    } else if (name === CMD.PROMPT) {
        return await handlePromptCmd(req);
    } else if (name === CMD.BATTLE) {
        return await handleBattleCmd(req);
    } else {
        // no valid command found
        console.log("No valid command found");
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "No valid command found" },
        });
    }
}

async function handleComponentInteraction(req: NextRequest) {
    const body = await req.json();
    const { custom_id } = body.data;
    
    if (custom_id.startsWith('battle_')) {
        const promptId = custom_id.replace('battle_', '');
        // TODO: Implement battle start logic
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { 
                content: `Starting battle with prompt ${promptId}...`,
                flags: InteractionResponseFlags.EPHEMERAL
            },
        });
    }

    // ... other component handlers
}

export { handleCommand, handleComponentInteraction };
export { BATTLE_COMMAND } from './battleCmd';
export { PROMPT_COMMAND } from './promptCmd';
export { TEST_COMMAND } from './testCmd';