'use client';

import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { LogoutAPI } from '@/app/api/client/auth-api';
import { logoutAction } from '@/actions/auth-action';
import { toast } from 'sonner';

export interface User {
    name: string;
    username: string;
    email: string;
    profile_image_url: string;
    is_superuser: boolean;
    tier_id: number;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
    children: ReactNode;
    initialUser: User | null;
}> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser);
    const router = useRouter();

    useEffect(() => {
        if (!initialUser) {
            logoutAction();
        }
    }, [initialUser]);

    const logout = async () => {

        const result =await logoutAction();
        if (result.success) {
            setUser(null);
            toast.success('Success');
            router.push('/login');
        } else {
            toast.error('Error');
        }
    };

    return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};
