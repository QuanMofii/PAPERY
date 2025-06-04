import axios, { AxiosError } from 'axios';

export interface APIError {
    message: string;
    status: number;
    name?: string;
    data?: any;
    timestamp: string;
    path: string;
}

interface BackendErrorResponse {
    name?: string;
    status?: number;
    detail?: string;
    data?: any;
}

class HttpError extends Error implements APIError {
    status: number;
    message: string;
    name: string;
    data?: any;
    timestamp: string;
    path: string;

    constructor(error: AxiosError | Error) {
        const defaultMessage = 'Unexpected error occurred. Please try later.';
        let message = defaultMessage;
        let status = 500;
        let name = 'Error';
        let data = {};
        let path = '';

        if (axios.isAxiosError(error)) {
            const backendError = error.response?.data as BackendErrorResponse;
            status = error.response?.status || backendError?.status || 500;
            name = backendError?.name || 'HttpError';
            message = backendError?.detail || defaultMessage;
            data = backendError?.data || {};
            path = error.config?.url || '';
        } else {
            message = error.message;
            name = error.name;
        }

        super(message);

        this.name = name;
        this.message = message;
        this.status = status;
        this.data = data;
        this.timestamp = new Date().toISOString();
        this.path = path;
    }
}

export { HttpError };
