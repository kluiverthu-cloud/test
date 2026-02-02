import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Solo protegemos las rutas de admin
    if (pathname.startsWith('/admin')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        // Si no hay token o no es admin, redirigir al login
        if (!token || token.role !== 'ADMIN') {
            const url = new URL('/auth', request.url)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin/:path*",
    ],
}
