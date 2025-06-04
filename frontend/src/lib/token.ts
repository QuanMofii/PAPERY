import { cookies } from 'next/headers';

import jwt, { JwtPayload } from 'jsonwebtoken';

export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch (error) {
        console.error('Failed to decode token:', error);

        return null;
    }
};

export const setAccessToken = async (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        console.error('Invalid access token: Missing exp');

        return;
    }

    const maxAge = decoded.exp - Math.floor(Date.now() / 1000);
    const cookieStore = await cookies();
    cookieStore.set('access_token', token, {
        maxAge,
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
};

export const setRefreshToken = async (token: string) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        console.error('Invalid refresh token: Missing exp');

        return;
    }

    const maxAge = decoded.exp - Math.floor(Date.now() / 1000);
    const cookieStore = await cookies();
    cookieStore.set('refresh_token', token, {
        maxAge,
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
};

export const removeAllTokens = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
};
