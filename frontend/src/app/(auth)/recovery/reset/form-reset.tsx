"use client";

import React, { useEffect, useState } from "react";
import { ResetReq, ResetReqType } from "@/schemas/auth.schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

const ResetForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy email và code từ URL
  const defaultEmail = searchParams.get("email") || "";
  const defaultCode = searchParams.get("code") || "";

  const [isLoading, setIsLoading] = useState(false);

  // Sử dụng react-hook-form với zod
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetReqType>({
    resolver: zodResolver(ResetReq),
    defaultValues: {
      email: defaultEmail || "",
      code: defaultCode || "",
      password: "",
      confirmpassword: "",
    },
  });

  // Cập nhật email và code nếu có trong URL
  useEffect(() => {
    if (defaultEmail) setValue("email", defaultEmail);
    if (defaultCode) setValue("code", defaultCode);
  }, [defaultEmail, defaultCode, setValue]);

  const onSubmit = async (data: ResetReqType) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("Reset Password Data Submitted:", data);
      // TODO: Gửi dữ liệu reset lên backend (email, code, password, confirmpassword)
      setTimeout(() => router.push("/login"), 2000); // Chuyển hướng đến login sau khi reset thành công
    } catch (error) {
      console.error("Reset Error:", error);
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
        {/* Email Input (hidden) */}
        <input
          type="hidden"
          {...register("email")}
        />

        {/* Code Input (hidden) */}
        <input
          type="hidden"
          {...register("code")}
        />

        {/* Password Input */}
        <div className="mb-2">
          <label htmlFor="password" className="text-gray-700 font-semibold">
            New Password:
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your new password"
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
          <label htmlFor="confirmpassword" className="text-gray-700 font-semibold">
            Confirm New Password:
          </label>
          <input
            type="password"
            id="confirmpassword"
            placeholder="Confirm your new password"
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

        {/* Submit Button */}
        <div className="flex justify-between items-center mb-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Reset Password
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetForm;
