import React from 'react';
import ForgotPasswordForm from './_form-forgot-password';

const ForgotPasswordPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Forgot Password?</h1>
                <div className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto">
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;