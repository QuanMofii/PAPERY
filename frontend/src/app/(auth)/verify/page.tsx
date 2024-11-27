import React from 'react';
import VerifyForm from '@/app/(auth)/verify/form-verify';

const VerifyPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Input Verify Code</h1>
                <VerifyForm/>
            </div>
        </div>
    );
};

export default VerifyPage;