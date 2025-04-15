'use client';

import { createContext, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { AuthStateType } from '@/schemas/auth.schemas';
import { UserProvider } from './user-context';
import { TokenRefresher } from '@/components/token-refresher';
import { logoutAction } from '@/actions/auth-action';

interface AuthContextType {
  authState: AuthStateType;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialAuthState
}: {
  children: React.ReactNode;
  initialAuthState: AuthStateType;
}) {
  useEffect(() => {
    const handleAuth = async () => {
      if (initialAuthState.status === 'error') {
        toast.error('Authentication Error', {
          description: initialAuthState.error,
          duration: 2000
        });
        const result = await logoutAction();
        toast[result.success ? 'success' : 'error'](result.success ? 'Success' : 'Error', {
          description: result.success ? 'Đã đăng xuất thành công' : 'Đăng xuất thất bại',
          duration: 2000
        });

      }
      else if (initialAuthState.status === 'unauthenticated') {
        toast.info('Authentication Info', {
          description: 'Please login to continue',
          duration: 2000
        });
      }
      else if (initialAuthState.status === 'authenticated') {
        toast.info('Authentication Info', {
          description: 'You are authenticated',
          duration: 2000
        });
      }
    };

    handleAuth();
  }, [initialAuthState]);

  return (
    <AuthContext.Provider value={{ authState: initialAuthState }}>
      <UserProvider initialUser={initialAuthState.user}>
        {children}
        <TokenRefresher />
      </UserProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
