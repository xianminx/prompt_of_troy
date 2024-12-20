import { NextRequest, NextResponse } from "next/server";
import { BattleService } from '@/services/BattleService';

const battleService = new BattleService();

export async function GET(_request: NextRequest) {
    try {
        const battles = await battleService.getAll();
        return NextResponse.json(battles);
    } catch (error) {
        console.error('Error fetching battles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch battles' },
            { status: 500 }
        );
    }
}

// POST route is commented out as it was in the original
// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const battle = await battleService.create(body);
//         return NextResponse.json(battle, { status: 201 });
//     } catch (error) {
//         console.error('Error creating battle:', error);
//         return NextResponse.json(
//             { error: 'Failed to create battle' },
//             { status: 500 }
//         );
//     }
// }