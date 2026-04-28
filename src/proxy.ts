import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'prime_looks_secret_development_key';
const key = new TextEncoder().encode(secretKey);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  let hostname = request.headers.get('host');

  // Handle internal requests without a host header
  if (!hostname) {
    return NextResponse.next();
  }

  // Remove port for local dev
  hostname = hostname.replace(/:\d+$/, '');

  // Check if it's a native master route
  const isMasterRoute = url.pathname.startsWith('/master');

  // Master Admin Domain (e.g. app.localhost)
  const isMasterDomain = hostname === 'app.localhost';

  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // 1. Check Auth for Admin routes (both Master and Store Admins)
  if (url.pathname.startsWith('/admin') || isMasterRoute || (isMasterDomain && !url.pathname.startsWith('/login'))) {
    // Skip checking on the login page itself
    if (url.pathname !== '/admin/login' && url.pathname !== '/master/login' && url.pathname !== '/login') {
      const sessionCookie = request.cookies.get('admin_session')?.value;
      if (!sessionCookie) {
        // Redirect to appropriate login
        return NextResponse.redirect(new URL((isMasterRoute || isMasterDomain) ? '/master/login' : '/admin/login', request.url));
      }
      try {
        await jwtVerify(sessionCookie, key, { algorithms: ['HS256'] });
      } catch (e) {
        const response = NextResponse.redirect(new URL((isMasterRoute || isMasterDomain) ? '/master/login' : '/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    }
  }

  // 2. Allow direct access to /master routes from any domain
  if (isMasterRoute) {
    return NextResponse.next();
  }

  // 3. Rewrite routing based on hostname
  if (isMasterDomain) {
    return NextResponse.rewrite(new URL(`/master${path}`, request.url));
  }

  // 4. For store domains
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
}
