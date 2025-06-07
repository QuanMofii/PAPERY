import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from '@/lib/next-intl/routing';
import { RefreshTokenAPI } from '@/app/api/client/auth.api';
import { decodeToken } from '@/lib/token';

// Định nghĩa các route
const PUBLIC_ROUTES = ['/login', '/register', '/examples', '/docs', '/static', '/_next', '/favicon.ico'];
const PROTECTED_ROUTES = ['/dashboard','chat'];
const AUTH_ONLY_ROUTES = ['/login', '/register'];
const intlMiddleware = createMiddleware(routing);

export default intlMiddleware;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // Xử lý next-intl middleware trước
    const intlResponse = await intlMiddleware(request);

    const stripLocalePrefix = (pathname: string) => {
        const locales = ['en', 'vi', 'fr']; // Danh sách các locale của bạn
        const match = pathname.match(new RegExp(`^/(${locales.join('|')})(/|$)`));

        return match ? pathname.replace(match[0], '/') : pathname;
    };

    const strippedPathname = stripLocalePrefix(pathname);

    // Nếu response đã được xử lý bởi next-intl (có redirect hoặc rewrite)
    // if (intlResponse.headers.get('x-middleware-rewrite') || intlResponse.headers.get('x-middleware-redirect')) {


    //     return intlResponse;
    // }

    // Bỏ qua các route public và static
    if (PUBLIC_ROUTES.some((route) => strippedPathname.startsWith(route)) && !AUTH_ONLY_ROUTES.includes(strippedPathname)) {
        return intlResponse;
    }

    // Lấy tokens từ cookie
    const hasAccessToken = request.cookies.has('access_token');
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // Nếu đang ở trang auth (login/register) và đã có refresh token
    // => redirect về dashboard
    if (AUTH_ONLY_ROUTES.includes(strippedPathname) && refreshToken) {
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        // Copy headers từ intlResponse
        intlResponse.headers.forEach((value, key) => {
            response.headers.set(key, value);
        });

        return response;
    }

    // Nếu đang ở trang protected
    if (PROTECTED_ROUTES.some((route) => strippedPathname.startsWith(route))) {

        // Nếu không có refresh token, redirect về login
        if (!refreshToken) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            // Copy headers từ intlResponse
            intlResponse.headers.forEach((value, key) => {
                response.headers.set(key, value);
            });

            return response;
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

                    // Copy headers từ intlResponse
                    intlResponse.headers.forEach((value, key) => {
                        nextResponse.headers.set(key, value);
                    });

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
            // Copy headers từ intlResponse
            intlResponse.headers.forEach((value, key) => {
                response.headers.set(key, value);
            });
            response.cookies.delete('refresh_token');

            return response;
        }
    }

    return intlResponse;
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
