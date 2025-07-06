import { http } from '@/lib/http';
import { Chat } from '@/registry/new-york-v4/ui/chat';
import { ListChatType } from '@/schemas/chat-list.schemas';
import { useListChatStore } from '@/store/chat-list.store';

import useNotification from './use-notification';

export default async function useDelete(
    path: string,
    id: string,
    deleteData: (value: any) => void,
    config = { withCredentials: true }
) {
    const response = await http.delete(`/${path}/${id}`, config);

    deleteData(id);

    useNotification('projects', response, 'deleted');

    return response;
}
