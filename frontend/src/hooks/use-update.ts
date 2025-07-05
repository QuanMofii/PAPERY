import { http } from '@/lib/http';
import { ListChatType } from '@/schemas/chat-list.schemas';
import { ProjectType } from '@/schemas/project-list.schemas';

import useNotification from './use-notification';

export default async function useUpdate(
    path: string,
    data: {},
    id: string,
    baseData: any,
    updateData: (value: any) => void,
    config = { withCredentials: true }
) {
    const response = await http.patch(`/${path}/${id}`, data, config);

    if (response.success) {
        updateData({
            ...baseData,
            ...data
        });
    }

    useNotification(path, response, 'update');

    return response;
}
