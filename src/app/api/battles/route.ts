import { NextRequest, NextResponse } from "next/server";
import { BattleService} from '@/services/BattleService';
import { type BattleSortableFields, type SortDirection } from '@/types/battle';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = (searchParams.get('sortBy') || 'createdAt') as BattleSortableFields;
        const sortDirection = (searchParams.get('sortDirection') || 'desc') as SortDirection;
        
        const paginatedBattles = await BattleService.getInstance().getPaginated(
            page,
            limit,
            sortBy,
            sortDirection
        );
        
        return NextResponse.json(paginatedBattles);
    } catch (error) {
        console.error('Error fetching battles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch battles' },
            { status: 500 }
        );
    }
}
