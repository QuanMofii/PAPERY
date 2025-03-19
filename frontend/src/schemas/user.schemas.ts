import { z } from 'zod';

export const User = z.object({
    id: z.string().uuid(),
    name: z.string().optional()
});

export const MeResponse = z.object({
    user: User
});

export type UserType = z.infer<typeof User>;
export type MeResponseType = z.infer<typeof MeResponse>;
