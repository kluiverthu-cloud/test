import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            // Admin routes require ADMIN role
            if (req.nextUrl.pathname.startsWith('/admin')) {
                return token?.role === 'ADMIN'
            }
            // By default allow access if matcher matches (but we restrict matcher below)
            return !!token
        },
    },
})

export const config = {
    matcher: [
        "/admin/:path*",
        // Add other protected routes here if needed
    ],
}
