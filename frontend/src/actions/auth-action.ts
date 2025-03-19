'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
    LoginAPI,
    LogoutAPI,
    RecoveryAPI,
    RefreshTokenAPI,
    RegisterAPI,
    ResetAPI,
    SocialAuthAPI,
    VerifyAPI
} from '@/app/api/client/auth-api';
import { setAccessToken, setRefreshToken } from '@/lib/token';
import {
    LoginRequest,
    LoginRequestType,
    RecoveryRequest,
    RecoveryRequestType,
    RegisterRequest,
    RegisterRequestType,
    ResetRequest,
    ResetRequestType,
    VerifyRequest,
    VerifyRequestType
} from '@/schemas/auth.schemas';

// await new Promise((resolve) => setTimeout(resolve, 2000));
//     console.log('Đã chờ xong 2 giây!');

export async function RegisterAction(data: RegisterRequestType) {
    const parsedData = RegisterRequest.safeParse(data);
    if (!parsedData.success) {
        return {
            success: false,
            error: { message: parsedData.error.errors.map((err) => err.message).join(', ') }
        };
    }

    const response = await RegisterAPI(parsedData.data);

    return response.success ? { success: true, data: response.data } : { success: false, error: response.error };
}

export async function LoginAction(data: LoginRequestType) {
    const parsedData = LoginRequest.safeParse(data);
    if (!parsedData.success) {
        return {
            success: false,
            error: { message: parsedData.error.errors.map((err) => err.message).join(', ') }
        };
    }

    const response = await LoginAPI(parsedData.data);

    if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        await setAccessToken(access_token);
        await setRefreshToken(refresh_token);

        return { success: true, data: response.data };
    }

    return { success: false, error: response.error };
}

export async function RecoveryAction(data: RecoveryRequestType) {
    const parsedData = RecoveryRequest.safeParse(data);
    if (!parsedData.success) {
        return {
            success: false,
            error: { message: parsedData.error.errors.map((err) => err.message).join(', ') }
        };
    }

    const response = await RecoveryAPI(parsedData.data);

    return response.success ? { success: true, data: response.data } : { success: false, error: response.error };
}

export async function VerifyAction(data: VerifyRequestType) {
    const parsedData = VerifyRequest.safeParse(data);
    if (!parsedData.success) {
        return {
            success: false,
            error: { message: parsedData.error.errors.map((err) => err.message).join(', ') }
        };
    }

    const response = await VerifyAPI(parsedData.data);

    return response.success ? { success: true, data: response.data } : { success: false, error: response.error };
}

export async function ResetAction(data: ResetRequestType) {
    const parsedData = ResetRequest.safeParse(data);
    if (!parsedData.success) {
        return {
            success: false,
            error: { message: parsedData.error.errors.map((err) => err.message).join(', ') }
        };
    }

    const response = await ResetAPI(parsedData.data);

    return response.success ? { success: true, data: response.data } : { success: false, error: response.error };
}

export async function SocialAuthAction(provider: string) {
    const response = await SocialAuthAPI(provider);

    return response;
}

export async function logout() {
    try {
        // Gọi API logout
        await LogoutAPI();

        // Xóa các cookies liên quan đến authentication
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return { success: true };
    } catch {
        return { success: false };
    }
}

export async function refreshTokenAction() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return { success: false, error: { message: 'No refresh token found' } };
    }

    const response = await RefreshTokenAPI(refreshToken);

    if (response.success && response.data) {
        const { access_token, refresh_token } = response.data;
        await setAccessToken(access_token);
        await setRefreshToken(refresh_token);

        return { success: true, data: response.data };
    }

    return { success: false, error: response.error };
}
