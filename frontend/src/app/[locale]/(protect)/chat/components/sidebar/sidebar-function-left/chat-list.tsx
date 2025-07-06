'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useDelete from '@/hooks/use-delete';
import useFetchList from '@/hooks/use-fetch-list';
import useQuery from '@/hooks/use-query';
import useUpdate from '@/hooks/use-update';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/new-york-v4/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/registry/new-york-v4/ui/sidebar';
import { ListChatType, UpdateListChatRequestType } from '@/schemas/chat-list.schemas';
import { useListChatStore } from '@/store/chat-list.store';

import { ChatListItems } from './chat-list-items';
import { ChevronRight, History, Star } from 'lucide-react';
import { toast } from 'sonner';

interface ChatItem {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
    projectId: string;
    favorite: boolean;
}

const HISTORY_ITEMS = [
    {
        title: 'Favorite' as const,
        icon: <Star className='h-4 w-4 group-data-[collapsible=icon]:cursor-pointer' />,
        isActive: true
    },
    {
        title: 'Recent' as const,
        icon: <History className='h-4 w-4 group-data-[collapsible=icon]:cursor-pointer' />,
        isActive: true
    }
];

export function ChatList() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const chatId = pathname.split('/').pop();
    const { chats, setChats, updateChat, removeChat } = useListChatStore();

    const [isLoading, setIsLoading] = useState(true);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');

    const [query] = useQuery({ page: 1, items_per_page: 10, project_uuid: projectId });
    if (projectId) useFetchList('chat-sessions', query, 'chat', setIsLoading);

    const handleStartEditing = (chat: ChatItem) => {
        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
        setOriginalTitle(chat.title);
    };

    const handleSaveTitle = (onUpdate: (id: string, updates: UpdateListChatRequestType) => void) => {
        if (!editingChatId) return;

        const chat = chats.find((c) => c.id === editingChatId);
        if (!chat) return;

        if (editingTitle.trim() && editingTitle !== chat.title) {
            try {
                onUpdate(editingChatId, {
                    title: editingTitle
                });
            } catch (error) {
                setEditingTitle(originalTitle);
            }
        } else {
            setEditingTitle(originalTitle);
        }

        setEditingChatId(null);
        setEditingTitle('');
        setOriginalTitle('');
    };

    const handleKeyDown = (
        e: React.KeyboardEvent,
        onUpdate: (id: string, updates: UpdateListChatRequestType) => void
    ) => {
        if (e.key === 'Enter') {
            handleSaveTitle(onUpdate);
        } else if (e.key === 'Escape') {
            setEditingTitle(originalTitle);
            setEditingChatId(null);
            setEditingTitle('');
            setOriginalTitle('');
        }
    };

    const handleDeleteChat = async (id: string) => {
        await useDelete('chat-sessions', id, removeChat);
    };

    const handleUpdateChat = async (id: string, updates: UpdateListChatRequestType) => {
        const chat = chats.find((c) => c.id === id);
        if (!chat) return;

        await useUpdate(
            'chat-sessions',
            {
                title: updates.title ?? chat.title
            },
            id,
            chat,
            updateChat
        );
    };

    const handleChatClick = (chatId: string) => {
        router.push(`/chat/${chatId}?projectId=${projectId}`);
    };

    // const handleToggleFavorite = (id: string) => {
    //     const chat = chats.find((c) => c.id === id);
    //     if (chat) {
    //         handleUpdateChat(id, {
    //             id: chat.id,
    //             title: chat.title,
    //             favorite: !chat.favorite
    //         });
    //     }
    // };

    return (
        <div className='w-full p-2'>
            {HISTORY_ITEMS.map((item) => (
                <Collapsible key={item.title} defaultOpen={item.isActive} className='group/collapsible'>
                    <CollapsibleTrigger className='w-full px-2 py-4'>
                        <div>
                            <div className='flex w-full items-center justify-between gap-2'>
                                <div className='flex items-center gap-2'>
                                    {item.icon}
                                    <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                                </div>
                                <ChevronRight className='ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90' />
                            </div>
                        </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className='group-data-[collapsible=icon]:hidden'>
                        <ChatListItems
                            chats={chats.filter((chat) => {
                                if (item.title === 'Favorite') return chat.favorite;
                                if (item.title === 'Recent') return !chat.favorite;

                                return true;
                            })}
                            activeChatId={chatId}
                            isEditing={isLoading}
                            editingChatId={editingChatId}
                            editingTitle={editingTitle}
                            onTitleChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleUpdateChat)}
                            onBlur={() => handleSaveTitle(handleUpdateChat)}
                            onEdit={handleStartEditing}
                            // onToggleFavorite={handleToggleFavorite}
                            onDelete={handleDeleteChat}
                            onClick={handleChatClick}
                        />
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    );
}
