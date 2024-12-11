import axios, { 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

console.log("process.env.NEXT_PUBLIC_BACKEND_API_URL",process.env.NEXT_PUBLIC_BACKEND_API_URL);
export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

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


class HttpError extends Error implements APIError {
  status: number;
  message: string;
  data?: any;
  timestamp?: string;
  path?: string;

  constructor(error: AxiosError | Error) {
    let message = 'Unknown Error';
    let status = 500;
    let data = {};
    let path = '';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.response?.data?.detail || error.message;
      status = error.response?.status || 500;

      data = error.response?.data || {}; 
      path = error.config?.url || '';
    } else {
      message = error.message;
    }

    super(message);
    
    this.name = 'HttpError';
    this.message = message;
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}


const getAPIURL = (config: HttpConfig = {}): string => {

  if (config.customURL) return config.customURL;

  switch (config.type) {
    case APIType.BACKEND:
      console.log("process.env.NEXT_PUBLIC_BACKEND_API_URL",process.env.NEXT_PUBLIC_BACKEND_API_URL);
      return (
        process.env.BACKEND_API_URL || 
        process.env.NEXT_PUBLIC_BACKEND_API_URL || 
        ''
      );
    case APIType.FRONTEND:
      return (
        process.env.FRONTEND_API_URL || 
        process.env.NEXT_PUBLIC_FRONTEND_API_URL || 
        ''
      );
    case APIType.EXTERNAL:
    default:
      return '';
  }
};


const createHttpClient = () => {

  const request = async (
    method: string, 
    url: string, 
    config: HttpConfig & AxiosRequestConfig = {}
  ) => {

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
    const API_VERSION = apiVersion || 
      process.env.API_VERSION || 
      process.env.NEXT_PUBLIC_API_VERSION || 
      'v1';

    const resolveURL = (inputURL: string): string => {
      if (/^https?:\/\//i.test(inputURL)) return inputURL;

      if (inputURL.startsWith('/')) {
        return type !== APIType.EXTERNAL 
          ? `${BASE_URL}/api/${API_VERSION}${inputURL}` 
          : inputURL;
      }
      console.log("inputURL",inputURL);
      return inputURL;
    };

    const tokenGetter = getToken || (async () => {
      return typeof window !== 'undefined' 
        ? localStorage.getItem('accessToken') || undefined
        : undefined;
    });

    try {

      const token = await tokenGetter();

      const headers = {
        'Ngrok-Skip-Browser-Warning': 'true',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
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

      return response.data;
    } catch (error) {
      throw new HttpError(error as AxiosError);
    }
  };

  return {
    get: (url: string,data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('GET', url, { ...config, data }),
    
    post: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('POST', url, { ...config, data }),
    
    put: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('PUT', url, { ...config, data }),
    
    patch: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('PATCH', url, { ...config, data }),
    
    delete: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('DELETE', url,{ ...config, data })
  };
};

export const http = createHttpClient();
export { HttpError };