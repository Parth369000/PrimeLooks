import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'prime_looks_secret_development_key';
const key = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip middleware for static assets, public routes, and the admin login page
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/admin/login') ||
    !pathname.startsWith('/admin')
  ) {
    return NextResponse.next();
  }

  // 2. Check for admin session
  const sessionCookie = request.cookies.get('admin_session')?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    // We verify JWT manually here because importing from @/lib/auth may 
    // trigger issues in edge runtime if not handled carefully.
    await jwtVerify(sessionCookie, key, {
      algorithms: ['HS256'],
    });
    return NextResponse.next();
  } catch (e) {
    // Session invalid or expired
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_session');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
