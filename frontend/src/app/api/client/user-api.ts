import { http } from '@/lib/http';

export const UserMeAPI = async () => {
    return await http.get('/users/me', {
        headers: {
            accept: 'application/json'
        },
        withCredentials: true
    });
};
