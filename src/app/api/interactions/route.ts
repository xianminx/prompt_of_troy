import {
    InteractionResponseType,
    InteractionType,
} from "discord-interactions";
import { NextRequest, NextResponse } from "next/server";
import { handleCommand, handleComponentInteraction } from "@/cmd/index";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { type } = body;

    try {
        if (type === InteractionType.PING) {
            return NextResponse.json({ type: InteractionResponseType.PONG });
        } else if (type === InteractionType.APPLICATION_COMMAND) {
            return handleCommand(request);
        } else if (type === InteractionType.MESSAGE_COMPONENT) {
            return handleComponentInteraction(request);
        } else {
            console.error("unknown interaction type", type);
            return NextResponse.json(
                { error: "unknown interaction type" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error handling interaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
