import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { discordInteractionVerification } from './middlewares/discord-verification'

// Middleware stack for different routes
const middlewareMap = {
    '/api/interactions': [discordInteractionVerification],
    // Add more route-middleware mappings as needed
    // '/api/players': [authMiddleware, rateLimitMiddleware],
    // '/api/prompts': [authMiddleware],
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    // Find the middleware stack for this path
    const middlewareStack = Object.entries(middlewareMap).find(([route]) => 
        path.startsWith(route)
    )?.[1]

    if (!middlewareStack) {
        return NextResponse.next()
    }

    // Execute each middleware in the stack
    for (const middlewareFn of middlewareStack) {
        const response = await middlewareFn(request)
        if (response.status !== 200) {
            return response
        }
    }

    return NextResponse.next()
}

// Configure the middleware to run on specified paths
export const config = {
    matcher: [
        '/api/interactions',
        // Add more paths as needed
        // '/api/players/:path*',
        // '/api/prompts/:path*',
    ]
}