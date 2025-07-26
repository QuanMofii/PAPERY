'use client';

import { http } from '@/lib/http';

import useNotification from './use-notification';
import { tranQueryToSting } from './use-query';

export default async function useCreate(
    path: string,
    data: any,
    baseData: any,
    setData: (value: any) => void,
    store: 'project' | 'chat',
    query: any,
    config = {
        withCredentials: true
    }
) {
    const queryString = tranQueryToSting(query);
    const response = await http.post(`/${path}${store === 'chat' ? `?${queryString}` : ''}`, data, config);

    const newData =
        store === 'project'
            ? {
                  id: response.data?.uuid,
                  name: data.name,
                  description: data.description
              }
            : { id: response.data.uuid, title: data.title };

    if (response.success) {
        setData([...baseData, newData]);
    }

    useNotification(path, response, 'created');

    return response;
}
