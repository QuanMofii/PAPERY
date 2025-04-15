import { z } from 'zod';

export const User = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    username: z.string(),
    email: z.string().email(),
    profile_image_url: z.string().url(),
    is_superuser: z.boolean(),
    tier_id: z.number()
});

export const MeResponse = z.object({
    user: User
});

export type UserType = z.infer<typeof User>;
export type MeResponseType = z.infer<typeof MeResponse>;
