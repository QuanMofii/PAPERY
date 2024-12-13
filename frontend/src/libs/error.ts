import axios, { AxiosError } from 'axios';
export interface APIError {
    message: string;
    status: number;
    code?: string;
    details?: any;
    timestamp?: string;
    path?: string;
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

export { HttpError };