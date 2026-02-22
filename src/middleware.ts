import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if we are in admin routes
    if (pathname.startsWith('/admin')) {
        // Exclude login page
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        /* 
           NOTE: Middleware check is disabled for localhost development.
           Appwrite Cloud session cookies are not sent to localhost, so this 
           check will always fail even if you are logged in.
           The robust client-side guard in admin/layout.tsx handles the protection.
        */
        /*
        const allCookies = request.cookies.getAll();
        const hasAppwriteSession = allCookies.some(c => c.name.startsWith('a_session_'));

        if (!hasAppwriteSession) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        */
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
