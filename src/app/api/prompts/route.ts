import { NextResponse } from "next/server";
import { PromptService } from '@/services/PromptService';
import { NextRequest } from "next/server";
import { type SortableFields, type SortDirection } from "@/types/prompt";

export async function GET(request: NextRequest) {
    try {
        // Get pagination parameters from URL
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') as SortableFields || 'createdAt';
        const sortDirection = searchParams.get('sortDirection') as SortDirection || 'desc';
        const createdBy = searchParams.get('createdBy') || undefined;
        const codeName = searchParams.get('codeName') || undefined;
        const type = searchParams.get('type') as 'attack' | 'defend' | undefined;

        const { prompts, total } = await PromptService.getInstance().getPaginated(
            page,
            limit,
            sortBy,
            sortDirection,
            createdBy,
            codeName,
            type
        );
        
        return NextResponse.json({
            prompts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        );
    }
}
