'use server';

import { cookies } from 'next/headers';

import { UserMeAPI } from '@/app/api/client/user-api';
import { User } from '@/context/UserContext';

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return null;
    }

    const response = await UserMeAPI();

    if (!response.success) {
        return null;
    }

    return response.data;
}
