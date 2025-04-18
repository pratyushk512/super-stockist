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

    // Allow access to login page
    if (path === '/') {
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

    if (path.startsWith('/sales/') && user.userType !== 'salesman') {
        return redirectToLogin(req);
    }

    return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
    return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
    matcher: ['/admin/:path+', '/sales/:path+'],
};
