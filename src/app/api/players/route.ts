import { NextResponse } from "next/server";
import { PlayerService } from '@/services/PlayerService';
import { NextRequest } from "next/server";
import { PlayerSortableFields, SortDirection } from "@/types/player";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = (searchParams.get('sortBy') || 'rating') as PlayerSortableFields;
        const sortDirection = (searchParams.get('sortDirection') || 'desc') as SortDirection;

        // Validate pagination parameters
        if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
            return NextResponse.json(
                { error: 'Invalid pagination parameters' },
                { status: 400 }
            );
        }
        const paginatedBattles = await PlayerService.getInstance().getPaginated(
            page,
            limit,
            sortBy,
            sortDirection
        );
        
        return NextResponse.json(paginatedBattles);
    } catch (error) {
        console.error('Error fetching players:', error);
        return NextResponse.json(
            { error: 'Failed to fetch players' },
            { status: 500 }
        );
    }
}