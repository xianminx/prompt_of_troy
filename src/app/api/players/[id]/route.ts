import {  NextRequest, NextResponse } from "next/server";
import { PlayerService } from '@/services/PlayerService';

const playerService = new PlayerService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const player = await playerService.getById(id);
        if (!player) {
            return NextResponse.json(
                { error: 'Player not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(player);
    } catch (error) {
        console.error('Error fetching player:', error);
        return NextResponse.json(
            { error: 'Failed to fetch player' },
            { status: 500 }
        );
    }
} 