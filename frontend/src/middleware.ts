import { NextRequest, NextResponse } from 'next/server';
import { removeAllTokens } from '@/libs/token';
import createMiddleware from 'next-intl/middleware';
import { Locales, DefaultLocale, LocalePrefix } from './constants/language';

const PUBLIC_ROUTES = ['/login', '/register', '/about', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

const nextIntlMiddleware = createMiddleware({
  locales: Locales,
  defaultLocale: DefaultLocale,
  localePrefix: LocalePrefix,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const strippedPathname = pathname.replace(/^\/(vi|en)/, "");
  const token = request.cookies.get('refresh_token');

  // 1. Kiểm tra Protected Routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // Nếu không có token, chuyển hướng về login
      removeAllTokens();
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Nếu có token, cho phép truy cập
    return NextResponse.next();
  }

  // 2. Kiểm tra Auth-Only Routes
  if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      // Nếu có token, chuyển hướng đến dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Nếu không có token, cho phép truy cập để login/register
    return NextResponse.next();
  }

  // 3. Xử lý Public Routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return nextIntlMiddleware(request);
  }

  // 4. Xử lý các route còn lại bằng nextIntlMiddleware
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: [
    '/(vi|en)/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
