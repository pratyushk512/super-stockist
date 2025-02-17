import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.TOKEN_SECRET!);

async function getUserFromToken(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    console.log("Path:", path);

    // Allow login pages to be accessed without authentication
    if (path === '/' || path === '/admin/' || path === '/sales/') {
        return NextResponse.next();
    }

    const user = await getUserFromToken(req);
    console.log("User:", user);

    if (!user) {
        return redirectToLogin(req);
    }

    // Role-based route protection
    if (path.startsWith('/admin/') && user.userType !== 'admin') {
        return redirectToLogin(req);
    } 
    if (path.startsWith('/sales/') && user.userType !== 'sales') {
        return redirectToLogin(req);
    } 
    if (!path.startsWith('/admin/') && !path.startsWith('/sales/') && user.userType !== 'customer') {
        return redirectToLogin(req);
    }

    return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
    const path = req.nextUrl.pathname;
    let loginRoute = '/';
    if (path.startsWith('/admin/') && path !== '/admin/') {
        loginRoute = '/admin/';
    } else if (path.startsWith('/sales/') && path !== '/sales/') {
        loginRoute = '/sales/';
    }
    return NextResponse.redirect(new URL(loginRoute, req.url));
}

export const config = {
    matcher: ['/admin/:path+', '/sales/:path+'],
};
