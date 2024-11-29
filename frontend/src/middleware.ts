import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { removeAllTokens } from '@/libs/token';

const PUBLIC_ROUTES = [ '/login', '/register', '/about', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('accesstoken')
    if (!token) {
      removeAllTokens();
      const signInUrl = new URL('/login', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}
