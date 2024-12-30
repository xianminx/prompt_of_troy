import { handlePromptCmd } from "./promptCmd";
import { handleTestCmd } from "./testCmd";
import { handleBattleCmd } from "./battleCmd";
import {
    InteractionResponseType,
    InteractionResponseFlags,
} from "discord-interactions";
import { NextResponse } from "next/server";

const CMD = {
    TEST: "test",
    PROMPT: "prompt",
    BATTLE: "battle",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCommand(body: any) {
    const { name } = body.data;

    if (name === CMD.TEST) {
        return await handleTestCmd();
    } else if (name === CMD.PROMPT) {
        return await handlePromptCmd(body);
    } else if (name === CMD.BATTLE) {
        return await handleBattleCmd(body);
    } else {
        // no valid command found
        console.log("No valid command found");
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "No valid command found" },
        });
    }
}

async function handleComponentInteraction(body: {
    data: { custom_id: string };
}) {
    const { custom_id } = body.data;

    if (custom_id.startsWith("battle_")) {
        const promptId = custom_id.replace("battle_", "");
        // TODO: Implement battle start logic
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Starting battle with prompt ${promptId}...`,
                flags: InteractionResponseFlags.EPHEMERAL,
            },
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDiscordUser(body: any) {
    const user = body.context === 0 ? body.member.user : body.user;
    if (!user) {
        throw new Error("User information not found");
    }
    return user;
}

export { handleCommand, handleComponentInteraction, getDiscordUser };
export { BATTLE_COMMAND } from "./battleCmd";
export { PROMPT_COMMAND } from "./promptCmd";
export { TEST_COMMAND } from "./testCmd";