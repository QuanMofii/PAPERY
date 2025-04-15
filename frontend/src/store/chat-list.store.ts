import { create } from 'zustand';
import { ListChatType } from '@/schemas/chat-list.schemas';

interface ListChatState {
    chats: ListChatType[];
    selectedChat: ListChatType | null;
    sortBy: 'name' | 'created' | 'updated';

    setChats: (chats: ListChatType[]) => void;
    setSelectedChat: (chat: ListChatType | null) => void;
    addChat: (chat: ListChatType) => void;
    updateChat: (chat: ListChatType) => void;
    removeChat: (chatId: string) => void;
    setSortBy: (sortBy: 'name' | 'created' | 'updated') => void;
}

export const useListChatStore = create<ListChatState>((set) => ({
    chats: [],
    selectedChat: null,
    sortBy: 'name',

    setChats: (chats) => {
        console.log('Setting chats:', chats);
        set({ chats });
    },
    setSelectedChat: (chat) => {
        console.log('Setting selected chat:', chat);
        set({ selectedChat: chat });
    },
    addChat: (chat) => {
        console.log('Adding chat:', chat);
        set((state) => ({ chats: [...state.chats, chat] }));
    },
    updateChat: (chat) => {
        console.log('Updating chat:', chat);
        set((state) => ({
            chats: state.chats.map((c) => (c.id === chat.id ? chat : c))
        }));
    },
    removeChat: (chatId) => {
        console.log('Removing chat:', chatId);
        set((state) => ({
            chats: state.chats.filter((c) => c.id !== chatId)
        }));
    },
    setSortBy: (sortBy) => {
        console.log('Setting sort by:', sortBy);
        set({ sortBy });
    }
}));
