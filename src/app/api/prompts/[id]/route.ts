import { NextRequest, NextResponse } from "next/server";
import { PromptService } from '@/services/PromptService';

const promptService = new PromptService();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        
        const id = (await params).id;
        const prompt = await promptService.getById(id);
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(prompt);
    } catch (error) {
        console.error('Error fetching prompt:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prompt' },
            { status: 500 }
        );
    }
}

// // Optionally add PUT/DELETE methods if needed
// export async function PUT(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const body = await request.json();
//         const updatedPrompt = await promptService.update(params.id, body);
//         if (!updatedPrompt) {
//             return NextResponse.json(
//                 { error: 'Prompt not found' },
//                 { status: 404 }
//             );
//         }
//         return NextResponse.json(updatedPrompt);
//     } catch (error) {
//         console.error('Error updating prompt:', error);
//         return NextResponse.json(
//             { error: 'Failed to update prompt' },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         const success = await promptService.delete(params.id);
//         if (!success) {
//             return NextResponse.json(
//                 { error: 'Prompt not found' },
//                 { status: 404 }
//             );
//         }
//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error('Error deleting prompt:', error);
//         return NextResponse.json(
//             { error: 'Failed to delete prompt' },
//             { status: 500 }
//         );
//     }
// } 