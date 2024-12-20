import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyKey } from 'discord-interactions'

export async function discordInteractionVerification(request: NextRequest) {
    const signature = request.headers.get("x-signature-ed25519");
    const timestamp = request.headers.get("x-signature-timestamp");
    const body = await request.clone().text();

    if (!signature || !timestamp || !body) {
        return NextResponse.json(
            { error: "Missing required headers" },
            { status: 401 }
        );
    }

    const isValid = verifyKey(
        body,
        signature,
        timestamp,
        process.env.DISCORD_PUBLIC_KEY!
    );

    if (!isValid) {
        return NextResponse.json(
            { error: "Invalid request signature" },
            { status: 401 }
        );
    }

    return NextResponse.next();
} 