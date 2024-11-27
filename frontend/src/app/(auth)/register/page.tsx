import React from 'react';
import RegisterForm from '@/app/(auth)/register/form-resister';

const RegisterPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Register</h1>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
