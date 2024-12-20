import { NextResponse } from "next/server";
import { PromptService } from '@/services/PromptService';

const promptService = new PromptService();

export async function GET() {
    try {
        const prompts = await promptService.getAll();
        return NextResponse.json(prompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompts' },
            { status: 500 }
        );
    }
}

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const {userId, type, content} = body;
//         const prompt = await promptService.create(userId, type, content);
//         return NextResponse.json(prompt, { status: 201 });
//     } catch (error) {
//         console.error('Error creating prompt:', error);
//         return NextResponse.json(
//             { error: 'Failed to create prompt' },
//             { status: 500 }
//         );
//     }
// }