// 'use server';

// import { cookies } from 'next/headers';

// import { GetCurrentUserAPI } from '@/app/api/client/user-api';

// import { jwtDecode } from 'jwt-decode';

// export interface User {
//     name: string;
//     username: string;
//     email: string;
//     profile_image_url: string;
//     is_superuser: boolean;
//     tier_id: number;
// }

// export async function getCurrentUser(): Promise<User | null> {
//     const cookieStore = await cookies();
//     const token = cookieStore.get('accessToken')?.value;

//     if (!token) {
//         return null;
//     }

//     try {
//         const decoded = jwtDecode(token) as any;
//         const response = await GetCurrentUserAPI();

//         return response.data;
//     } catch (error) {
//         return null;
//     }
// }

// export async function logout() {
//     const cookieStore = await cookies();

//     // Xóa cả access token và refresh token
//     cookieStore.delete('accessToken');
//     cookieStore.delete('refreshToken');

//     return { success: true };
// }
