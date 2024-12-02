// src/services/auth/register/route.ts
import { http } from '@/libs/http';
import { RegisterResponse } from '@/helpers/types/auth.types';

export const register = async (email: string, password: string, name: string): Promise<RegisterResponse> => {
  const response = await http.post('/auth/register', { email, password, name });
  return response;
};