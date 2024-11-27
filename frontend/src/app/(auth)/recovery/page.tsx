import React from 'react';
import RecoveryForm from '@/app/(auth)/recovery/form-recovery';

const RecoveryPage = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="h-full w-full flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Forgot Password?</h1>
                <RecoveryForm />
            </div>
        </div>
    );
};

export default RecoveryPage;