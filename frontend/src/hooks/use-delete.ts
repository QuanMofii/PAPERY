import { http } from '@/lib/http';

export default async function useDelete(path: string, id: string, config = { withCredentials: true }) {
    const response = await http.delete(`/${path}/${id}`, config);

    return response;
}
