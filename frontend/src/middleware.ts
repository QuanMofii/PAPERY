import { NextRequest, NextResponse } from 'next/server';
import { removeAllTokens } from '@/libs/token';
import createMiddleware from 'next-intl/middleware';


const PUBLIC_ROUTES = ['/login', '/register', '/about', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

const nextIntlMiddleware = createMiddleware({
  locales: ['en', 'vi', 'jp'],
  defaultLocale: 'en',
  localePrefix: 'never',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('refresh_token');

  // Check public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return nextIntlMiddleware(request); 
  }

  // Check auth-only routes
  if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return nextIntlMiddleware(request);
  }

  // Check protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      removeAllTokens();
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Default: apply nextIntlMiddleware
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
