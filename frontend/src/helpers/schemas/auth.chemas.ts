// src/helpers/authSchemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmpassword: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
}).refine((data) => data.password === data.confirmpassword, {
  path: ["confirmpassword"], 
  message: "Passwords do not match",
});

export const RecoverySchema = z.object({
  email: z.string().email("Invalid email address")
});

export const VerifySchema = z.object({
  verify: z.string().min(6, "Code must be at least 6 characters long"),
});

export const  ResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmpassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmpassword, {
  path: ["confirmpassword"], 
  message: "Passwords do not match",
});
    
