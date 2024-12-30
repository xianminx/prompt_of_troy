import { NextResponse } from "next/server";
import { PromptService } from "@/services/PromptService";
import { NextRequest } from "next/server";
import { PromptType, type PromptSortableFields, type SortDirection } from "@/types/prompt";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const sortBy = (searchParams.get("sortBy") || "createdAt") as PromptSortableFields;
        const sortDirection = (searchParams.get("sortDirection") || "desc") as SortDirection;
        const createdBy = searchParams.get("createdBy") || undefined;
        const codeName = searchParams.get("codeName") || undefined;
        const type = searchParams.get("type") as PromptType;

        const paginatedBattles = await PromptService.getInstance().getPaginated(
            page,
            limit,
            sortBy,
            sortDirection,
            createdBy,
            codeName,
            type
        );

        return NextResponse.json(paginatedBattles);
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}
