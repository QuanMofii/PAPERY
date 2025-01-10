"use client";

import React, { useEffect, useState, Suspense } from "react";
import { VerifyReq, VerifyReqType } from "@/schemas/auth.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

const  ConfirmAccountForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaulEmail = searchParams.get("email") || "";
  const defaulCode = searchParams.get("code") || "";

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyReqType>({
    resolver: zodResolver(VerifyReq),
    defaultValues: {
      email: defaulEmail || "",
      code: defaulCode || "",
    },
  });

  useEffect(() => {
    if (defaulEmail) setValue("email", defaulEmail);
    if (defaulCode) setValue("code", defaulCode);
  }, [defaulEmail, defaulCode, setValue]);

  const onSubmit = async (data: VerifyReqType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("Verification Data Submitted:", data);
      // TODO: Gửi mã xác thực và email lên backend
    router.push(`/login?email=${encodeURIComponent(data.email)}`); 
    } catch (error) {
      console.error("Verification Error:", error);
      // TODO: Xử lý lỗi từ backend (nếu có)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center w-screen h-screen">
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

        {/* Verify Input */}
        <div className="mb-4">
          <label htmlFor="verify" className="text-gray-700 font-semibold">
            Verify Code:
          </label>
          <input
            type="text"
            id="code"
            placeholder="Enter your verify code"
            {...register("code")}
            className={`w-full p-2 border ${
              errors.code ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
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
            Continue
          </button>
        </div>
      </form>
    </>
  );
};

const SuspendedConfirmAccountForm  = () => (
  <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
      <ConfirmAccountForm/>
  </Suspense>
);
export default SuspendedConfirmAccountForm ;
