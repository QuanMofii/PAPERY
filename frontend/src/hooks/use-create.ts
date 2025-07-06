'use client';

import { http } from '@/lib/http';
import { useListChatStore } from '@/store/chat-list.store';

import useNotification from './use-notification';

export default async function useCreate(
    path: string,
    data: any,
    baseData: any,
    setData: (value: any) => void,
    config = {
        withCredentials: true
    }
) {
    const response = await http.post(`/${path}`, data, config);

    if (response.success) {
        setData([
            ...baseData,
            {
                id: response.data.uuid,
                name: data.name,
                description: data.description
            }
        ]);
    }

    useNotification('projects', response, 'deleted');

    return response;
}
