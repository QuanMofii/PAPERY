// import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const sessionToken = request.cookies.get('auth-token');

//   if (
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/api') ||
//     pathname.includes('/static') ||
//     pathname.includes('.') ||
//     pathname.endsWith('.ico')  
//     || pathname ===('/')
//   ) {
//     return NextResponse.next();
//   }


  
//   if (sessionToken && (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/recovery') || pathname.startsWith('/verify'))) {
//     const response = NextResponse.redirect(new URL('/dashboard', request.url));
//     return response;
//   }


//   if (!sessionToken && (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/recovery') || pathname.startsWith('/verify'))) {
//     return NextResponse.next();
//   }

//   if (!sessionToken) {
//     const response = NextResponse.redirect(new URL('/login', request.url));
//     return response;
//   }

//   const response = NextResponse.next();
  
//   return response;
  
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|api|favicon\\.ico|.*\\..*).*)'
//   ],
// };

import { NextRequest, NextResponse } from 'next/server';
import { ensureValidToken, removeAllTokens } from '@/libs/token';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/about', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard', '/onboarding'];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = await ensureValidToken();

    if (!token) {
      removeAllTokens();
      const signInUrl = new URL('/login', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'], 
};
