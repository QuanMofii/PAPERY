import { http } from '@/lib/http';

export default async function useUpdate(path: string, data: {}, id: string, config = { withCredentials: true }) {
    const response = await http.patch(`/${path}/${id}`, data, config);

    return response;
}
