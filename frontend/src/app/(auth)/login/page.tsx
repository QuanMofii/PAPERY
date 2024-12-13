import LoginForm from '@/app/(auth)/login/_form-login';
import React from 'react';


const LoginPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Login</h1>
                <div className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto"><LoginForm/></div>
            </div>
        </div>
    );
};

export default LoginPage;
