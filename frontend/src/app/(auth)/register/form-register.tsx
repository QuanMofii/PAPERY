"use client";

import React, { useState } from "react";
import { RegisterReq, RegisterReqType } from "@/schemas/auth.schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegisterForm = () => {
  console.log("RegisterForm");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterReqType>({
    resolver: zodResolver(RegisterReq),
  });

  const onSubmit = async (data: RegisterReqType) => {
    if (isLoading) return;
    setIsLoading(true); // Đặt isLoading lên true ngay lập tức
    try {
      console.log("Form submitted:", data);
      // TODO: Gửi dữ liệu đến backend để đăng ký tài khoản
      router.push(`/register/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Registration error:", error);
      // TODO: Xử lý lỗi từ backend nếu có
    } finally {
      setIsLoading(false); // Đặt lại isLoading để ẩn processing
    }
  };

  const handleGoogleRegister = () => {
    console.log("Sign up with Google");
    // TODO: Xử lý logic đăng ký bằng Google
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="text-center">
            <p className="text-white mt-2 text-lg">Processing...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={`${isLoading ? "pointer-events-none opacity-50" : ""}`}
      >
        {/* Name Input */}
        <div className="mb-2">
          <label htmlFor="name" className="text-gray-700 font-semibold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            {...register("name")}
            className={`w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

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
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-2">
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

        {/* Confirm Password Input */}
        <div className="mb-4">
          <label
            htmlFor="confirmpassword"
            className="text-gray-700 font-semibold"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="Confirm your password"
            {...register("confirmpassword")}
            className={`w-full p-2 border ${
              errors.confirmpassword ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.confirmpassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmpassword.message}
            </p>
          )}
        </div>

        {/* Register Button */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Register
          </button>
        </div>

        {/* Google Register */}
        <div className="flex justify-center items-center mb-2">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className={`w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/login" className="text-blue-500 hover:underline ml-1">
            Login
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
