import { useEffect, useState } from 'react';

import { http } from '@/lib/http';

export default function useFetchList(path: string, query = {}, config = { withCredentials: true }) {
    const [data, setData] = useState({});
    useEffect(() => {
        const fetchList = async () => {
            const queryString = new URLSearchParams(query).toString(); //chuyen query thanh string
            const res = await http.get(`/${path}/?${queryString}`, config);
            setData(res);
        };
        fetchList();
    }, [path, JSON.stringify(query), JSON.stringify(config)]);

    return data;
}
