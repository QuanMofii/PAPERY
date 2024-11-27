"use client";
import React, { useState } from 'react';
import { ResetSchema } from '@/helpers/schemas/authschemas';
import { useRouter } from 'next/navigation';

const ResetForm: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmpassword, setConfirmpassword] = useState<string>('');
    const [errors, setErrors] = useState<{name?: string; email?: string; password?: string ;confirmpassword?: string}>({});
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = ResetSchema.safeParse({ password, confirmpassword });

        if (!result.success) {
            const errorMessages = result.error.errors.reduce(
                (acc, { path, message }) => ({ ...acc, [path[0]]: message }),{}
            );
            setErrors(errorMessages);
        } else {
            setErrors({});
            router.push('/login');
        }


    };

    return (
        <form onSubmit={handleSubmit} noValidate className="text-left bg-white p-6 rounded-lg shadow-md  mx-auto">
            <div className="mb-2">
                <label htmlFor="password" className="text-gray-700 font-semibold">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    placeholder='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
            </div>
            <div className="mb-4">
                <label htmlFor="confirmpassword" className="text-gray-700 font-semibold">Confirm new password:</label>
                <input
                    type="confirmpassword"
                    id="confirmpassword"
                    value={confirmpassword}
                    placeholder='Enter your confirm password'
                    onChange={(e) =>  setConfirmpassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirmpassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmpassword}</p>}
            </div>
 
            <div className="flex justify-between items-center mb-2">
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Reset Password
                </button>
            </div>
        </form>
    );
};

export default ResetForm;
