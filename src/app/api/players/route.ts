import { NextResponse } from "next/server";
import { PlayerService } from '@/services/PlayerService';

const playerService = new PlayerService();

export async function GET() {
    try {
        const players = await playerService.getAll();
        return NextResponse.json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json(
            { error: 'Failed to fetch players' },
            { status: 500 }
        );
    }
}

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const player = await playerService.create(body);
//         return NextResponse.json(player, { status: 201 });
//     } catch (error) {
//         console.error('Error creating player:', error);
//         return NextResponse.json(
//             { error: 'Failed to create player' },
//             { status: 500 }
//         );
//     }
// }