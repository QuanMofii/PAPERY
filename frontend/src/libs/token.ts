import jwt, { JwtPayload } from 'jsonwebtoken';
import { getCookie, setCookie, deleteCookie } from 'cookies-next'; 
import { http } from '@/libs/http'; 

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const setAccessToken = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    console.error('Invalid access token: Missing exp');
    return;
  }

  const maxAge = decoded.exp - Math.floor(Date.now() / 1000); 
  setCookie('accessToken', token, {
    maxAge,
    path: '/',
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
  });
};

export const setRefreshToken = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    console.error('Invalid refresh token: Missing exp');
    return;
  }

  const maxAge = decoded.exp - Math.floor(Date.now() / 1000); 
  setCookie('refreshToken', token, {
    maxAge,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
  });
};

export const removeAllTokens = () => {
  deleteCookie('accessToken', { path: '/' });
  deleteCookie('refreshToken', { path: '/' });
};
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getCookie('refreshToken') as string | undefined;

  if (!refreshToken) {
    console.error('No refresh token found in cookies');
    removeAllTokens();
    return null;
  }

  try {
    const response = await http.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) setAccessToken(accessToken); 
    if (newRefreshToken) setRefreshToken(newRefreshToken); 

    return accessToken || null;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    removeAllTokens();
    return null;
  }
};

export const ensureValidToken = async (): Promise<string | null> => {
  const token = getCookie('accessToken') as string | undefined;

  if (token) {
    return token; 
  }

  console.log('Access token missing or expired, attempting to refresh...');
  return await refreshAccessToken();
};