"use client";
import React, { useState } from 'react';
import { RecoverySchema } from '@/helpers/schemas/auth.chemas';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RecoveryForm = () => {
    const [email, setEmail] = useState<string>('');
    const [errors, setErrors] = useState<{ email?: string;}>({});
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = RecoverySchema.safeParse({ email });

        if (!result.success) {
            const errorMessages = result.error.errors.reduce(
                (acc, { path, message }) => ({ ...acc, [path[0]]: message }),{}
            );
            setErrors(errorMessages);
        } else {
            setErrors({});
            router.push(`/recovery/verify?email=${encodeURIComponent(email)}`);
        }


    };
    // const handleGetBack = () => {
    //     router.push('/recovery');
    // }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
                <label htmlFor="email" className="text-gray-700 font-semibold">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder='Enter your email'
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
            </div>
 
            <div className="flex justify-between items-center mb-2">
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200">
                    Recovery password
                </button>
            </div>

            {/* <div className="flex justify-center items-center mb-2">
                <button
                    type="button"
                    onClick={handleGetBack}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200">
                    Not you?
                </button>
            </div> */}
            <div className="text-center ">
                <span className="text-gray-600">Already have an account?</span>
                <Link href="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
            </div>
        </form>
    );
};

export default RecoveryForm;
