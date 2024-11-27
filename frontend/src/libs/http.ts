import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ensureValidToken } from '@/libs/token';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
const API_VERSION = process.env.NEXT_PUBLIC_BACKEND_API_VERSION || '';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
});
const Headers = (token: string | undefined, customHeaders: any) => {
  return {
    'Ngrok-Skip-Browser-Warning': 'true',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...customHeaders,
  };
};


const axiosWrapper = async (url: string, config: AxiosRequestConfig): Promise<AxiosResponse<any>> => {
  const token = await ensureValidToken();
  if (!token) {
    throw new Error('Unauthorized: No valid token available');
  }
  const headers = Headers(token, config.headers || {});

  try {
    const response = await axiosInstance({
      url,
      ...config,
      headers,
    });
    return response;
  } catch (error) {
    console.error("API call failed:", error);
    throw new Error('API call failed');
  }
};

const axiosStreamWrapper = async (url: string, config: AxiosRequestConfig): Promise<any> => {
  const token = await ensureValidToken();
  if (!token) {
    throw new Error('Unauthorized: No valid token available');
  }
  const headers = Headers(token, config.headers || {});

  try {
    const response = await axiosInstance({
      url,
      ...config,
      headers,
      responseType: 'stream',
    });

    response.data.on('data', (chunk: any) => {
      console.log('Receiving chunk:', chunk);
    });

    response.data.on('end', () => {
      console.log('Stream ended.');
    });

    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw new Error('API call failed');
  }
};

export const http = {
  get: async (url: string, config: AxiosRequestConfig = {}) => {
    const response = await axiosWrapper(url, { ...config, method: 'GET' });
    return response.data;
  },

  post: async (url: string, data: any, config: AxiosRequestConfig = {}) => {
    const response = await axiosWrapper(url, { ...config, method: 'POST', data });
    return response.data;
  },

  put: async (url: string, data: any, config: AxiosRequestConfig = {}) => {
    const response = await axiosWrapper(url, { ...config, method: 'PUT', data });
    return response.data;
  },

  delete: async (url: string, config: AxiosRequestConfig = {}) => {
    const response = await axiosWrapper(url, { ...config, method: 'DELETE' });
    return response.data;
  },

  option: async (url: string, config: AxiosRequestConfig = {}) => {
    const response = await axiosWrapper(url, { ...config, method: 'OPTIONS' });
    return response.data;
  },

  getStream: async (url: string, config: AxiosRequestConfig = {}) => {
    return axiosStreamWrapper(url, { ...config, method: 'GET' });
  },
};
