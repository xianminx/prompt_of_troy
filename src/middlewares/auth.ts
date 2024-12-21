import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function authMiddleware(request: NextRequest) {
    // Authentication logic here
    const body = await request.json();
    console.log("body", body);
    return NextResponse.next()
} 
