import { useEffect, useState } from 'react';

import { parseData } from '@/hooks/use-gets';
import { http } from '@/lib/http';
import { Select } from '@/registry/new-york-v4/ui/select';

import { description } from './../registry/new-york-v4/charts/chart-line-linear';

export default function useGet(
    path: string,
    id: any,
    setSelectData: (value: any) => void,
    config = {
        withCredentials: true
    }
) {
    useEffect(() => {
        const fetch = async () => {
            const response = await http.get(`/${path}/${id}`, config);
            if (!id) {
                setSelectData({});
            }
            setSelectData(response.data);
        };
        fetch();
    }, [path, id]);
}
