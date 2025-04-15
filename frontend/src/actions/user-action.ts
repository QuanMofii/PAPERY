'use server';

import { cookies } from 'next/headers';
import { UserMeAPI } from '@/app/api/client/user-api';
import { AuthStateSchema } from '@/schemas/auth.schemas';

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return {
            status: 'unauthenticated' as const,
            user: null
        };
    }

    const response = await UserMeAPI();

    if (!response.success) {
        return {
            status: 'error' as const,
            error: response.error?.message || 'Failed to get user info',
            user: null
        };
    }

    return {
        status: 'authenticated' as const,
        user: response.data
    };
}
