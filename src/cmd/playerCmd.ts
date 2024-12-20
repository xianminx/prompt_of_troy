import { NextRequest, NextResponse } from "next/server";
import { InteractionResponseType } from "discord-interactions";

async function handlePlayerCmd(req: NextRequest) {
    // const body = await req.json();
    // Add your player command logic here
    
    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "Player command response" },
    });
}

const PLAYER_COMMAND = {
    name: 'player',
    description: 'Player related commands',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

export { handlePlayerCmd, PLAYER_COMMAND };
