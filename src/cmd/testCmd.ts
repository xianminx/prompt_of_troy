import { InteractionResponseType } from "discord-interactions";
import { NextRequest, NextResponse } from "next/server";

async function handleTestCmd(_req: NextRequest) {
    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: "``` This is a message to <@947726501976113222> ```" },
    });
    // let embed = new Embed(
    //     title="Copy Text",
    //     description="```This is the text to copy```",
    //     color=discord.Color.blue()
    // )
    // await ctx.send(embed=embed)
}

// Simple test command
const TEST_COMMAND = {
    name: 'test',
    description: 'Basic command',
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
};

export { handleTestCmd, TEST_COMMAND };