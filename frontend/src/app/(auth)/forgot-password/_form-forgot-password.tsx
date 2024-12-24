"use client";
import React, { useEffect, useState, Suspense } from "react";
import { RecoveryReq, RecoveryReqType } from "@/schemas/auth.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const defaultEmail = searchParams.get("email") || "";

  // Sử dụng react-hook-form với zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RecoveryReqType>({
    resolver: zodResolver(RecoveryReq),
    defaultValues: {
      email: defaultEmail,
    },
  });

  // Set email mặc định nếu có từ URL
  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const onSubmit = async (data: RecoveryReqType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("Recovery Email Submitted:", data);
      // TODO: Gửi email để phục hồi tài khoản
      
    router.push(`/confirm-email?email=${encodeURIComponent(data.email)}`);
     
    } catch (error) {
      console.error("Recovery Error:", error);
      // TODO: Xử lý lỗi từ backend (nếu có)
    } finally {
      setIsLoading(false);
    }
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
        <div className="mb-4">
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

        {/* Submit Button */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Recovery Password
          </button>
        </div>

        {/* Links */}
        <div className="text-center">
          <span className="text-gray-600">Already have an account?</span>
          <Link href="/login" className="text-blue-500 hover:underline ml-1">
            Login
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

const SuspendedForgotPasswordForm  = () => (
  <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
      <ForgotPasswordForm/>
  </Suspense>
);
export default SuspendedForgotPasswordForm ;
