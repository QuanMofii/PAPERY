'use client';

import React, { ReactNode, createContext, useContext, useState} from 'react';

import { useRouter } from 'next/navigation';


import { logoutAction } from '@/actions/auth-action';
import { toast } from 'sonner';
import { UserType } from '@/schemas/user.schemas';

interface UserContextType {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{
    children: ReactNode;
    initialUser: UserType | null;
}> = ({ children, initialUser }) => {

    const [user, setUser] = useState<UserType | null>(initialUser);
    const router = useRouter();



    const logout = async () => {

        const result =await logoutAction();
        if (result.success) {
            setUser(null);
            toast.success('Success',{description: 'Logout successfully'});
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
