import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { RefreshTokenAPI } from '@/app/api/client/auth-api';
import { decodeToken } from '@/lib/token';

// Định nghĩa các route
const PUBLIC_ROUTES = ['/login', '/register', '/examples', '/docs', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Bỏ qua các route public và static
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && !AUTH_ONLY_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    // Lấy tokens từ cookie
    const hasAccessToken = request.cookies.has('access_token');
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // Nếu đang ở trang auth (login/register) và đã có refresh token
    // => redirect về dashboard
    if (AUTH_ONLY_ROUTES.includes(pathname) && refreshToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Nếu đang ở trang protected
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        // Nếu không có refresh token, redirect về login
        if (!refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Nếu không có access token nhưng có refresh token, thử refresh
        if (!hasAccessToken && refreshToken) {
            try {
                const response = await RefreshTokenAPI(refreshToken);

                if (response.success && response.data) {
                    const { access_token, refresh_token } = response.data;

                    // Decode tokens để lấy thời gian hết hạn
                    const accessTokenDecoded = decodeToken(access_token);
                    const refreshTokenDecoded = decodeToken(refresh_token);

                    if (!accessTokenDecoded?.exp || !refreshTokenDecoded?.exp) {
                        throw new Error('Invalid token format');
                    }

                    // Tính thời gian còn lại
                    const accessTokenMaxAge = accessTokenDecoded.exp - Math.floor(Date.now() / 1000);
                    const refreshTokenMaxAge = refreshTokenDecoded.exp - Math.floor(Date.now() / 1000);

                    // Tạo response mới
                    const nextResponse = NextResponse.next();

                    // Set cookies mới với maxAge
                    nextResponse.cookies.set('access_token', access_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: accessTokenMaxAge
                    });

                    nextResponse.cookies.set('refresh_token', refresh_token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        path: '/',
                        maxAge: refreshTokenMaxAge
                    });

                    return nextResponse;
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
            }

            // Nếu refresh thất bại, xóa refresh token và redirect về login
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('refresh_token');

            return response;
        }
    }

    return NextResponse.next();
}

// Chỉ định các route sẽ chạy qua middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};
