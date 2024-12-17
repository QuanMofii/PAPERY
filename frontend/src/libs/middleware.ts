import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { removeAllTokens } from '@/libs/token';

const PUBLIC_ROUTES = [ '/login', '/register', '/about', '/static', '/_next', '/favicon.ico','locales/','locales/.*', '.*\\..*'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];
const AUTH_ONLY_ROUTES = ['/login', '/register',];
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('refresh_token')
  
  if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {

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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|locales/.*|.*\\..*).*)',
  ],
}
