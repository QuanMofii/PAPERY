"use client";

import React, { useState } from "react";
import { LoginReq, LoginReqType } from "@/schemas/auth.schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginReqType>({
    resolver: zodResolver(LoginReq),
  });

  const onSubmit = async (data: LoginReqType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("Form submitted:", data);
      // TODO: Gửi dữ liệu đến backend
      
      router.push("/dashboard"); // Chuyển hướng người dùng đến dashboard
    } catch (error) {
      console.error("Error during login request:", error);
      alert("An unexpected error occurred. Please try again later.");
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={`${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        {/* Email Input */}
        <div className="mb-2">
          <label htmlFor="email" className="text-gray-700 font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
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
          <Link href="/recovery" className="text-blue-500 hover:underline">
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

export default LoginForm;
