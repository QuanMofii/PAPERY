import { HttpError } from './error';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export enum APIType {
    BACKEND = 'BACKEND',
    FRONTEND = 'FRONTEND',
    EXTERNAL = 'EXTERNAL'
}

export interface HttpConfig {
    type?: APIType;
    customURL?: string;
    apiVersion?: string;
    getToken?: () => Promise<string | undefined>;
    defaultHeaders?: Record<string, string>;
}

const getAPIURL = (config: HttpConfig = {}): string => {
    if (config.customURL) return config.customURL;

    switch (config.type) {
        case APIType.BACKEND:
            return process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
        case APIType.FRONTEND:
            return process.env.FRONTEND_API_URL || process.env.NEXT_PUBLIC_FRONTEND_API_URL || '';
        case APIType.EXTERNAL:
        default:
            return '';
    }
};

// Hàm lấy token từ cookie ở client-side
const getClientToken = (): string | undefined => {
    if (typeof window === 'undefined') return undefined;

    return document.cookie
        .split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];
};

// Hàm lấy token từ cookie ở server-side
const getServerToken = async (): Promise<string | undefined> => {
    if (typeof window !== 'undefined') return undefined;

    try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();

        return cookieStore.get('access_token')?.value;
    } catch (error) {
        console.error('Error getting server token:', error);

        return undefined;
    }
};

const createHttpClient = () => {
    const request = async (method: string, url: string, config: HttpConfig & AxiosRequestConfig = {}) => {
        const {
            data,
            type = APIType.BACKEND,
            customURL,
            apiVersion,
            getToken,
            defaultHeaders,
            ...axiosConfig
        } = config;

        const BASE_URL = getAPIURL({ type, customURL });
        const API_VERSION = apiVersion || process.env.API_VERSION || process.env.NEXT_PUBLIC_API_VERSION || 'v1';

        const resolveURL = (inputURL: string): string => {
            if (/^https?:\/\//i.test(inputURL)) return inputURL;

            if (inputURL.startsWith('/')) {
                return type !== APIType.EXTERNAL ? `${BASE_URL}/api/${API_VERSION}${inputURL}` : inputURL;
            }

            return inputURL;
        };

        try {
            let token;

            // Ưu tiên sử dụng getToken được truyền vào
            if (getToken) {
                token = await getToken();
            } else {
                // Nếu không có getToken, thử lấy từ cookie
                if (typeof window !== 'undefined') {
                    // Client-side
                    token = getClientToken();
                } else {
                    // Server-side
                    token = await getServerToken();
                }
            }

            const language = 'en';
            const headers = {
                'Ngrok-Skip-Browser-Warning': 'true',
                'Content-Type': 'application/json',
                'X-Language': language,
                ...(token && { Authorization: `Bearer ${token}` }),
                ...defaultHeaders,
                ...axiosConfig.headers
            };

            const response = await axios({
                ...axiosConfig,
                method,
                url: resolveURL(url),
                data,
                headers
            });

            return { success: true, data: response.data.data };
        } catch (error) {
            return { success: false, error: new HttpError(error as AxiosError) };
        }
    };

    return {
        get: (url: string, config?: HttpConfig & AxiosRequestConfig) => request('GET', url, config),

        post: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) =>
            request('POST', url, { ...config, data }),

        put: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) =>
            request('PUT', url, { ...config, data }),

        patch: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) =>
            request('PATCH', url, { ...config, data }),

        delete: (url: string, config?: HttpConfig & AxiosRequestConfig) => request('DELETE', url, config)
    };
};

export const http = createHttpClient();
export { HttpError };
