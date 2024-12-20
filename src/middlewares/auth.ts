import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function authMiddleware(request: NextRequest) {
    // Authentication logic here
    return NextResponse.next()
} 