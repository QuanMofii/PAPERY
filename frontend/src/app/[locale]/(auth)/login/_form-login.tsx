"use client";

import React, { useState, Suspense, useMemo } from "react";

import {http, HttpError} from "@/libs/http"
import { LoginReq, LoginReqType } from "@/schemas/auth.schemas";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import { useTranslations } from 'next-intl';
import {useTranslation} from '@/libs/i18n/client';

const LoginForm = () => {
  const{t}  = useTranslation("login");
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginReqType>({
    resolver: zodResolver(LoginReq(t)),
  });

  const onSubmit = async (data: LoginReqType) => {
  if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("Form submitted:", data);
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await http.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        withCredentials: true, 
      });
      
      router.push("/dashboard"); 
    } catch (error: any) {
      if (error instanceof HttpError) {
        const errorMessage = error.message;
        alert(`Error: ${errorMessage} (Status: ${error.status})`);
      } else {
        alert("Unexpected error occurred. Please try later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Sign in with Google");
    // TODO: Thực hiện logic đăng nhập bằng Google
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center ">
          <div className="text-center">
            <p className="text-white mt-2">Processing...</p>
          </div>
        </div>
      )}
  
      {/* <LanguageSwitcher/> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={`${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        {/* Email Input */}
        <div className="mb-2">
          <label htmlFor="email" className="text-gray-700 font-semibold">
          {t('form.email')}:
          </label>
          <input
            type="email"
            id="email"
            placeholder={t('form.email_placeholder')}
            {...register("email")}
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="text-gray-700 font-semibold">
            Password:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`w-full p-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Google Login */}
        <div className="flex justify-center items-center mb-2">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Signup with Google
          </button>
        </div>

        {/* Links */}
        <div className="text-center">
          <Link href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center">
          <span className="text-gray-600">Don&apos;t have an account yet?</span>
          <Link href="/register" className="text-blue-500 hover:underline ml-1">
            Register
          </Link>
        </div>
      </form>
    </>
  );
};


LoginForm.getNamespaces = () => ["common", "login"]; 
const SuspendedLoginForm = () => (
    <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
        <LoginForm/>
    </Suspense>
  );
export default SuspendedLoginForm;
  // export default React.memo(LoginForm);

