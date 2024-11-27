import React from 'react';
import LoginForm from '@/app/(auth)/login/form-login';

const LoginPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h1>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
