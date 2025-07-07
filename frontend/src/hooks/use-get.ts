import { useEffect, useState } from 'react';

import { http } from '@/lib/http';

export default function useGet(
    path: string,
    id: any,
    config = {
        withCredentials: true
    }
) {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetch = async () => {
            const response = await http.get(`/${path}/${id}`, config);
            console.log(response);
            setData(response.data);
        };
        fetch();
    }, [path, id]);

    return data;
}
