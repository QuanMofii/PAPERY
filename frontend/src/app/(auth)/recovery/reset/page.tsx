import React from 'react';
import ResetForm from '@/app/(auth)/recovery/reset/form-reset';

const ResetPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">New Password</h1>
                <div className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto"> 
                    <ResetForm/>
                </div>
            </div>
        </div>
    );
};

export default ResetPage;