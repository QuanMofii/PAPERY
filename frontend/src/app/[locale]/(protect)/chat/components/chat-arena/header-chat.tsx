'use client';

import { useParams } from 'next/navigation';

import useGet from '@/hooks/use-get';
import { useListChatStore } from '@/store/chat-list.store';

export default function HeaderChat() {
    const { selectedChat, setSelectedChat } = useListChatStore();
    const param: { id: string[] } = useParams();
    useGet('chat-sessions', param.id, setSelectedChat);

    return <div className='flex-1 text-center'>{selectedChat?.title}</div>;
}
