import { NextRequest, NextResponse } from "next/server";
import { BattleService } from '@/services/BattleService';

const battleService = new BattleService();

export async function GET(_req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const battle = await battleService.getById(params.id);
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