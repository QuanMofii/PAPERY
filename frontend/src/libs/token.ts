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


export const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;

  try {
    const { exp } = decodeToken(token) || {};
    if (!exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); 
    return exp > currentTime; 
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token found in cookies');
      return null;
    }
    const { accessToken } = await http.post('/auth/refresh', { refreshToken });
    setTokenInCookie(accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    removeAllTokens();
    return null;
  }
};

export const setTokenInCookie = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    console.error('Invalid token: Missing exp');
    return;
  }

  const expTime = new Date(decoded.exp * 1000); 
  const maxAge = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 0); 

  if (maxAge > 0) {
    setCookie('accessToken', token, { maxAge: maxAge / (60 * 60 * 24) });
  }
};

export const removeAllTokens = () => {
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
};

export const ensureValidToken = async (): Promise<string | null> => {
  const token = await getCookie('accessToken')|| null;;

  if (!token ) {
    console.log('No token found in cookie.');
    return null;
  }

  if (token && isTokenValid(token)) {
    return token;
  }

  console.log('Token expired, attempting refresh...');
  return await refreshToken(); 
  
};
