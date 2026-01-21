import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected paths
  const isProtectedPath = pathname.startsWith('/dashboard') ||
    (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/') && !pathname.startsWith('/api/seed-admin') && !pathname.startsWith('/api/test-db'));

  if (isProtectedPath) {
    if (!token) {
      // If it's an API request, return 401
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Yetkisiz erişim. Lütfen giriş yapın.' },
          { status: 401 }
        );
      }
      // If it's a page request, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to dashboard if already logged in and trying to access login/register
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};
