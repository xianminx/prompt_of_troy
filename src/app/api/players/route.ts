import { NextResponse } from "next/server";
import { PlayerService } from '@/services/PlayerService';
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Get page and limit from URL search params
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        // Validate pagination parameters
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return NextResponse.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            );
        }

        const { players, total } = await PlayerService.getInstance().getPaginated(page, limit);
        
        return NextResponse.json({
            players,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json(
            { error: 'Failed to fetch players' },
            { status: 500 }
        );
    }
}