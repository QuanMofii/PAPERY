import { NextRequest, NextResponse } from 'next/server';
import { removeAllTokens } from '@/libs/token';
import createMiddleware from 'next-intl/middleware';
import { Locales , DefaultLocale , LocalePrefix} from './constants/language';


const PUBLIC_ROUTES = ['/login', '/register', '/about', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

const nextIntlMiddleware = createMiddleware({
  locales: Locales || ["en", "vi"],
  defaultLocale: DefaultLocale || "en",
  localePrefix: LocalePrefix || "never",
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('refresh_token');

  let response;

  // Check public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    response = nextIntlMiddleware(request);
  } 
  // Check auth-only routes
  else if (AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    response = nextIntlMiddleware(request);
  } 
  // Check protected routes
  else if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) {
      removeAllTokens();
      return NextResponse.redirect(new URL('/login', request.url));
    }
    response = nextIntlMiddleware(request);
  } 
  // Default: apply nextIntlMiddleware
  else {
    response = nextIntlMiddleware(request);
  }

  // Thêm pathname vào header
  response.headers.set('x-page-pathname', pathname);
  

  return response;
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
};
