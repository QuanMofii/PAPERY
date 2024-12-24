import React from 'react';
import ConfirmEmailForm from '@/app/(auth)/confirm-email/_form-confirm-email';

const ConfirmEmailPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Input Confirm Email Code</h1>
                <div className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto"><ConfirmEmailForm/></div>
            </div>
        </div>
    );
};

export default ConfirmEmailPage;