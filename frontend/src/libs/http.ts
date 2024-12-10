import axios, { 
  AxiosRequestConfig, 
  AxiosResponse, 
  AxiosError 
} from 'axios';

// Kiểu dữ liệu cho lỗi chi tiết
export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;
}

// Enum để xác định loại API
export enum APIType {
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  EXTERNAL = 'EXTERNAL'
}

export interface HttpConfig {
  type?: APIType;          // Loại API
  customURL?: string;      // URL tùy chỉnh (nếu cần)
  apiVersion?: string;     // Phiên bản API
  getToken?: () => Promise<string | undefined>;  // Hàm lấy token tùy chỉnh
  defaultHeaders?: Record<string, string>;  // Headers mặc định
}

// Lớp để xử lý và chuẩn hóa lỗi
class HttpError extends Error implements APIError {
  status: number;
  code?: string;
  details?: any;
  timestamp?: string;
  path?: string;

  constructor(error: AxiosError | Error) {
    let message = 'Unknown Error';
    let status = 500;
    let code = 'UNKNOWN_ERROR';
    let details = {};
    let path = '';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
      status = error.response?.status || 500;
      code = error.response?.data?.code || 'AXIOS_ERROR';
      details = error.response?.data?.details || {};
      path = error.config?.url || '';
    } else {
      message = error.message;
    }

    super(message);
    
    this.name = 'HttpError';
    this.message = message;
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.path = path;
  }
}

// Hàm lấy URL dựa trên cấu hình
const getAPIURL = (config: HttpConfig = {}): string => {
  // Nếu có URL tùy chỉnh, ưu tiên sử dụng
  if (config.customURL) return config.customURL;

  // Xác định URL dựa trên loại API
  switch (config.type) {
    case APIType.BACKEND:
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

// Hàm tạo HTTP client
const createHttpClient = () => {
  // Wrapper chung cho các request
  const request = async (
    method: string, 
    url: string, 
    data?: any, 
    config: HttpConfig & AxiosRequestConfig = {}
  ) => {
    // Phân tách cấu hình HTTP và Axios
    const { 
      type = APIType.BACKEND, 
      customURL, 
      apiVersion, 
      getToken, 
      defaultHeaders, 
      ...axiosConfig 
    } = config;

    // Xác định URL
    const BASE_URL = getAPIURL({ type, customURL });
    const API_VERSION = apiVersion || 
      process.env.API_VERSION || 
      process.env.NEXT_PUBLIC_API_VERSION || 
      'v1';

    // Phân giải URL
    const resolveURL = (inputURL: string): string => {
      // Nếu URL đã là URL đầy đủ, không cần thay đổi
      if (/^https?:\/\//i.test(inputURL)) return inputURL;

      // Nếu URL bắt đầu bằng '/', ghép với base URL
      if (inputURL.startsWith('/')) {
        return type !== APIType.EXTERNAL 
          ? `${BASE_URL}/api/${API_VERSION}${inputURL}` 
          : inputURL;
      }

      // Trường hợp còn lại, giữ nguyên URL
      return inputURL;
    };

    // Hàm lấy token mặc định
    const tokenGetter = getToken || (async () => {
      return typeof window !== 'undefined' 
        ? localStorage.getItem('accessToken') || undefined
        : undefined;
    });

    try {
      // Lấy token
      const token = await tokenGetter();

      // Tạo headers
      const headers = {
        'Ngrok-Skip-Browser-Warning': 'true',
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...defaultHeaders,
        ...axiosConfig.headers
      };

      // Thực hiện request
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

  // Trả về các phương thức HTTP
  return {
    get: (url: string, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('GET', url, undefined, config),
    
    post: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('POST', url, data, config),
    
    put: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('PUT', url, data, config),
    
    patch: (url: string, data: any, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('PATCH', url, data, config),
    
    delete: (url: string, config: HttpConfig & AxiosRequestConfig = {}) => 
      request('DELETE', url, undefined, config)
  };
};

// Tạo HTTP client
export const http = createHttpClient();
export { HttpError };