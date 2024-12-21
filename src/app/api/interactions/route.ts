import {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} from "discord-interactions";
import { NextRequest, NextResponse } from "next/server";
import { handleCommand, handleComponentInteraction } from "@/cmd/index";


export async function POST(request: NextRequest) {

    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.text()


    if (!signature || !timestamp || !body) {
        console.error("verifyInteraction missing required headers");
        return NextResponse.json(
            { error: "Missing required headers" },
            { status: 401 }
        );
    }

    const isValid = await verifyKey(body, signature, timestamp, process.env.DISCORD_PUBLIC_KEY!);
    if (!isValid) {
        console.error("verifyInteraction invalid request signature");
        return NextResponse.json(
            { error: "Invalid request signature" },
            { status: 401 }
        );
    }

    const { type } = JSON.parse(body);

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
