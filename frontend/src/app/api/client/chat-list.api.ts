import { http } from '@/lib/http';
import {
    CreateListChatRequestType,
    UpdateListChatRequestType
} from '@/schemas/chat-list.schemas';

export const GetAllChatsAPI = async (projectId: string) => {
    return await http.get(`/chats/project/${projectId}`, {withCredentials:true});
};

export const CreateChatAPI = async (data: CreateListChatRequestType) => {
    return await http.post('/chats', data, {withCredentials:true});
};

export const UpdateChatAPI = async (data: UpdateListChatRequestType) => {
    return await http.put(`/chats/${data.id}`, data, {withCredentials:true});
};

export const DeleteChatAPI = async (id: string) => {
    return await http.delete(`/chats/${id}`, {withCredentials:true});
};


