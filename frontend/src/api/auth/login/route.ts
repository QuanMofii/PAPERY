// src/services/auth/login/route.ts
import { http } from '@/libs/http';
import { LoginResponse } from '@/helpers/types/authTypes';

export const login = async (email: string, password: string): Promise<LoginResponse> => {

  const response = await http.post('/auth/login', {
    email,
    password,
  });
  return response;
};

export const refresh_token = async (): Promise<void> => {
  await http.get('/auth/refresh-token');
};
