'use client';

import { useEffect, useRef, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { DeleteChatAPI, GetAllChatsAPI, UpdateChatAPI } from '@/app/api/client/chat-list.api';
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

const MOCK_CHATS: ChatItem[] = [
    {
        id: '1',
        title: 'Chat 1',
        updatedAt: '2024-03-20T10:00:00Z',
        createdAt: '2024-03-20T10:00:00Z',
        projectId: '1',
        favorite: true
    },
    {
        id: '2',
        title: 'Chat 2',
        updatedAt: '2024-03-20T09:00:00Z',
        createdAt: '2024-03-20T09:00:00Z',
        projectId: '1',
        favorite: false
    },
    {
        id: '3',
        title: 'Chat 3',
        updatedAt: '2024-03-19T15:00:00Z',
        createdAt: '2024-03-19T15:00:00Z',
        projectId: '1',
        favorite: true
    },
    {
        id: '4',
        title: 'Chat 4',
        updatedAt: '2024-03-19T14:00:00Z',
        createdAt: '2024-03-19T14:00:00Z',
        projectId: '1',
        favorite: false
    }
];

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
    const { stateLeft, setOpen } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const chatId = pathname.split('/').pop();
    const { chats, setChats } = useListChatStore();

    const [isLoading, setIsLoading] = useState(true);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if (!projectId) return;

        const fetchChats = async () => {
            setIsLoading(true);
            // const response = await GetAllChatsAPI(projectId);
            const response = {
                success: true,
                data: MOCK_CHATS
            };

            if (response.success) {
                setChats(response.data);
            } else {
                toast.error('Error', { description: 'Failed to fetch chats', duration: 2000 });
            }

            setIsLoading(false);
        };

        if (chats.length === 0) {
            fetchChats();
        } else {
            setIsLoading(false);
        }
    }, [projectId, chats.length, setChats]);

    const handleStartEditing = (chat: ChatItem) => {
        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
        setOriginalTitle(chat.title);
    };

    const handleSaveTitle = async (onUpdate: (id: string, updates: UpdateListChatRequestType) => void) => {
        if (!editingChatId) return;

        const chat = chats.find((c) => c.id === editingChatId);
        if (!chat) return;

        if (editingTitle.trim() && editingTitle !== chat.title) {
            try {
                await onUpdate(editingChatId, {
                    id: chat.id,
                    title: editingTitle,
                    favorite: chat.favorite
                });
            } catch (error) {
                setEditingTitle(originalTitle);
                toast.error('Error', { description: 'Failed to update chat title', duration: 2000 });
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
        const response = await DeleteChatAPI(id);
        if (response.success) {
            setChats(chats.filter((chat) => chat.id !== id));
            toast.success('Success', { description: 'Chat deleted successfully', duration: 2000 });
        } else {
            toast.error('Error', { description: response.error?.message, duration: 2000 });
        }
    };

    const handleUpdateChat = async (id: string, updates: UpdateListChatRequestType) => {
        const chat = chats.find((c) => c.id === id);
        if (!chat) return;

        const response = await UpdateChatAPI({
            id,
            title: updates.title ?? chat.title,
            favorite: updates.favorite ?? chat.favorite
        });

        if (response.success) {
            setChats(chats.map((chat) => (chat.id === id ? { ...chat, ...updates } : chat)));
            toast.success('Success', { description: 'Chat updated successfully', duration: 2000 });
        } else {
            throw new Error(response.error?.message);
        }
    };

    const handleChatClick = (chatId: string) => {
        router.push(`/chat/${chatId}?projectId=${projectId}`);
    };

    const handleToggleFavorite = (id: string) => {
        const chat = chats.find((c) => c.id === id);
        if (chat) {
            handleUpdateChat(id, {
                id: chat.id,
                title: chat.title,
                favorite: !chat.favorite
            });
        }
    };

    const handleHeaderClick = (title: string) => {
        if (stateLeft === 'collapsed') {
            setOpen(true);
        }
    };

    return (
        <SidebarGroup className='flex max-h-full flex-1 flex-col overflow-x-hidden overflow-y-auto pt-0'>
            <SidebarGroupLabel className='bg-background sticky top-0 z-50 group-data-[collapsible=icon]:hidden'>
                History Chat
            </SidebarGroupLabel>

            <SidebarMenu>
                {HISTORY_ITEMS.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className='group/collapsible'>
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={item.title} onClick={() => handleHeaderClick(item.title)}>
                                    <div className='flex w-full items-center justify-between gap-2'>
                                        <div className='flex items-center gap-2'>
                                            {item.icon}
                                            <span className='group-data-[collapsible=icon]:hidden'>{item.title}</span>
                                        </div>
                                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90' />
                                    </div>
                                </SidebarMenuButton>
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
                                    onToggleFavorite={handleToggleFavorite}
                                    onDelete={handleDeleteChat}
                                    onClick={handleChatClick}
                                />
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
