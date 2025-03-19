import { User } from './user.schemas';
import { z } from 'zod';

/* Schema chung có thể tái sử dụng */
const EmailSchema = z.object({
    email: z.string().email('Invalid email address')
});

const PasswordSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

const CodeSchema = z.object({
    code: z.string().min(6, 'Code must be at least 6 characters long')
});

const TokenSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string()
});

const UserSchema = z.object({
    user: User
});

/* Schema có confirm password (chỉ dùng sau khi merge với PasswordSchema) */
const ConfirmPasswordSchema = z.object({
    confirmpassword: z.string().min(6, 'Password must be at least 6 characters long')
});

/* Schema sử dụng lại các phần chung */
export const LoginRequest = EmailSchema.merge(PasswordSchema);

export const RegisterRequest = EmailSchema.merge(PasswordSchema)
    .merge(ConfirmPasswordSchema)
    .extend({
        name: z.string().min(2, 'Name must be at least 2 characters long')
    })
    .refine((data) => data.password === data.confirmpassword, {
        path: ['confirmpassword'],
        message: 'Passwords do not match'
    });

export const RecoveryRequest = EmailSchema;

export const VerifyRequest = EmailSchema.merge(CodeSchema);

export const ResetRequest = EmailSchema.merge(CodeSchema)
    .merge(PasswordSchema)
    .merge(ConfirmPasswordSchema)
    .refine((data) => data.password === data.confirmpassword, {
        path: ['confirmpassword'],
        message: 'Passwords do not match'
    });

export const LoginResponse = TokenSchema.merge(UserSchema);

export const RegisterResponse = TokenSchema.merge(UserSchema);

/* 🎯 TypeScript Types */
export type LoginRequestType = z.infer<typeof LoginRequest>;
export type RegisterRequestType = z.infer<typeof RegisterRequest>;
export type RecoveryRequestType = z.infer<typeof RecoveryRequest>;
export type VerifyRequestType = z.infer<typeof VerifyRequest>;
export type ResetRequestType = z.infer<typeof ResetRequest>;

export type UserType = z.infer<typeof User>;
export type LoginResponseType = z.infer<typeof LoginResponse>;
export type RegisterResponseType = z.infer<typeof RegisterResponse>;
