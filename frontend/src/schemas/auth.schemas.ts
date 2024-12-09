import { z } from 'zod';

// Request Schemas
export const LoginReq = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterReq = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmpassword: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
}).refine((data) => data.password === data.confirmpassword, {
  path: ["confirmpassword"], 
  message: "Passwords do not match",
});

export const RecoveryReq  = z.object({
  email: z.string().email("Invalid email address")
});

export const VerifyReq = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().min(6, "Code must be at least 6 characters long"),
});

export const ResetReq = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().min(6, "Code must be at least 6 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmpassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmpassword, {
  path: ["confirmpassword"], 
  message: "Passwords do not match",
});


export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
});

export const LoginRes = z.object({
  token: z.string(),
  user: User,
});

export const RegisterRes = z.object({
  token: z.string(),
  user: User,
});

export const MeRes = z.object({
  user: User,
});

// Request Types 
export type LoginReqType = z.infer<typeof LoginReq>;
export type RegisterReqType = z.infer<typeof RegisterReq>;
export type RecoveryReqType = z.infer<typeof RecoveryReq>;
export type VerifyReqType = z.infer<typeof VerifyReq>;
export type ResetReqType = z.infer<typeof ResetReq>;


// Response Types
export type UserType = z.infer<typeof User>;
export type LoginResType = z.infer<typeof LoginRes>;
export type RegisterResType = z.infer<typeof RegisterRes>;
export type MeResType = z.infer<typeof MeRes>;