'use client';

import React, { ReactNode, createContext, useContext, useState } from 'react';

import { useRouter } from 'next/navigation';

import { logout as logoutAction } from '@/actions/auth-action';

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

    const logout = async () => {
        try {
            const result = await logoutAction();
            if (result.success) {
                setUser(null);
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout failed');
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
