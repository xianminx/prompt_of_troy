import { NextRequest, NextResponse } from "next/server";
import { BattleService } from '@/services/BattleService';

const battleService = new BattleService();
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        const battle = await battleService.getById(id);
        if (!battle) {
            return NextResponse.json(
                { error: 'Battle not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(battle);
    } catch (error) {
        console.error('Error fetching battle:', error);
        return NextResponse.json(
            { error: 'Failed to fetch battle' },
            { status: 500 }
        );
    }
} 