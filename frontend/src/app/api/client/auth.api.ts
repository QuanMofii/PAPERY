import { http } from '@/lib/http';
import {
    LoginRequestType,
    RecoveryRequestType,
    RegisterRequestType,
    ResetRequestType,
    VerifyRequestType
} from '@/schemas/auth.schemas';

export const RegisterAPI = async (data: RegisterRequestType) => {
    return await http.post('/register', data);
};

export const LoginAPI = async (data: LoginRequestType) => {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);

    return await http.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
    });
};

export const RecoveryAPI = async (data: RecoveryRequestType) => {
    return await http.post('/forgot-password', data);
};

export const VerifyAPI = async (data: VerifyRequestType) => {
    return await http.post('/confirm-email', data);
};

export const ResetAPI = async (data: ResetRequestType) => {
    return await http.post('/reset-password', data);
};

export const SocialAuthAPI = async (provider: string) => {
    return await http.get(`/auth/${provider}`, { withCredentials: true });
};

export const RefreshTokenAPI = async (refresh_token: string) => {
    return await http.post(
        '/refresh-token',
        { refresh_token },
        {
            withCredentials: true
        }
    );
};

export const LogoutAPI = async (refresh_token: string | undefined) => {
    return await http.post('/logout', { refresh_token }, {
        withCredentials: true
    });
};
