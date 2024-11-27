"use client";
import React, { useState } from 'react';
import { registerSchema } from '@/helpers/schemas/authschemas';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmpassword, setConfirmpassword] = useState<string>('');
    const [errors, setErrors] = useState<{name?: string; email?: string; password?: string ;confirmpassword?: string}>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = registerSchema.safeParse({name, email, password, confirmpassword });

        if (!result.success) {
            const errorMessages = result.error.errors.reduce(
                (acc, { path, message }) => ({ ...acc, [path[0]]: message }),{}
            );
            setErrors(errorMessages);
        } else {
            setErrors({});
            router.push('/verify');

    
        }
    };

    const handleGoogleregister = () => {
        // Thêm logic đăng nhập với Google ở đây
        console.log("Đăng nhập bằng Google");
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="text-left bg-white p-6 rounded-lg shadow-md mx-auto">
             <div className="mb-2">
                <label htmlFor="name" className="text-gray-700 font-semibold">Name:</label>
                <input
                    type="name"
                    id="name"
                    value={name}
                    placeholder='Enter your name'
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
            </div>
            <div className="mb-2">
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
            <div className="mb-2">
                <label htmlFor="password" className="text-gray-700 font-semibold">Password:</label>
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
                <label htmlFor="confirmpassword" className="text-gray-700 font-semibold">Confirm password:</label>
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
                    Register
                </button>
            </div>
            <div className="flex justify-center items-center mb-2">
                <button
                    type="button"
                    onClick={handleGoogleregister}
                    className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200">
                    Signup with Google
                </button>
            </div>
            <div className="text-center ">
                <Link href="/recovery" className="text-blue-500 hover:underline">Forgot Password?</Link>
            </div>
            <div className="text-center ">
                <span className="text-gray-600">Already have an account?</span>
                <Link href="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
            </div>
        </form>
    );
};

export default RegisterForm;
