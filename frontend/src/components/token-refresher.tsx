'use client';

import { useEffect, useRef } from 'react';

import { refreshTokenAction } from '@/actions/auth-action';

import jwt, { JwtPayload } from 'jsonwebtoken';

const checkAndRefreshToken = async () => {
    const accessTokenCookie = document.cookie.split('; ').find((row) => row.startsWith('access_token='));
    if (!accessTokenCookie) return;

    const accessToken = accessTokenCookie.split('=')[1];
    if (!accessToken) return;

    const decoded = jwt.decode(accessToken) as JwtPayload;
    if (!decoded?.exp) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    const oneHour = 60 * 60;

    if (timeUntilExpiry < oneHour) {
        await refreshTokenAction();
    }
};

export function TokenRefresher() {
    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const isRefreshing = useRef<boolean>(false);

    useEffect(() => {
        const runCheck = async () => {
            if (isRefreshing.current) return;

            try {
                isRefreshing.current = true;
                await checkAndRefreshToken();
            } finally {
                isRefreshing.current = false;
            }
        };

        // Initial check
        runCheck();

        // Setup interval
        timerRef.current = setInterval(runCheck, 30 * 60 * 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return null;
}
