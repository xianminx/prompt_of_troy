import { NextRequest, NextResponse } from "next/server";
import { BattleService, type SortableFields, type SortDirection } from '@/services/BattleService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = (searchParams.get('sortBy') || 'createdAt') as SortableFields;
        const sortDirection = (searchParams.get('sortDirection') || 'desc') as SortDirection;
        
        const { battles, total } = await BattleService.getInstance().getPaginated(
            page,
            limit,
            sortBy,
            sortDirection
        );
        
        return NextResponse.json({
            battles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching battles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch battles' },
            { status: 500 }
        );
    }
}