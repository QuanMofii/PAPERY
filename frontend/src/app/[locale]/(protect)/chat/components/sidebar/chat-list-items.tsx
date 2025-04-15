'use client';

import { ListChatType, UpdateListChatRequestType } from '@/schemas/chat-list.schemas';
import { Skeleton } from '@/registry/new-york-v4/ui/skeleton';
import { Button } from '@/registry/new-york-v4/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { Edit, MoreVertical, Trash2, Star } from 'lucide-react';

interface ChatListItemsProps {
    chats: ListChatType[];
    activeChatId: string | undefined;
    isEditing: boolean;
    editingChatId: string | null;
    editingTitle: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onBlur: () => void;
    onEdit: (chat: ListChatType) => void;
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onClick: (id: string) => void;
}

export function ChatListItems({
    chats,
    activeChatId,
    isEditing,
    editingChatId,
    editingTitle,
    onTitleChange,
    onKeyDown,
    onBlur,
    onEdit,
    onToggleFavorite,
    onDelete,
    onClick
}: ChatListItemsProps) {
    if (isEditing) {
        return (
            <div className='space-y-2 p-2'>
                {Array(3)
                    .fill(0)
                    .map((_, i) => (
                        <Skeleton key={i} className='h-16 w-full' />
                    ))}
            </div>
        );
    }

    return (
        <div className='space-y-2 p-2'>
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className={`hover:bg-accent cursor-pointer rounded-md p-2 transition-colors ${
                        activeChatId === chat.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => onClick(chat.id)}>
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-1 flex-col gap-1'>
                            {editingChatId === chat.id ? (
                                <input
                                    type='text'
                                    value={editingTitle}
                                    onChange={onTitleChange}
                                    onKeyDown={onKeyDown}
                                    onBlur={onBlur}
                                    className='bg-transparent text-sm font-medium outline-none'
                                    autoFocus
                                />
                            ) : (
                                <span className='line-clamp-1 text-sm font-medium'>{chat.title}</span>
                            )}
                            <span className='text-muted-foreground text-xs'>{chat.updatedAt}</span>
                        </div>

                        {editingChatId !== chat.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                                        <MoreVertical className='h-4 w-4' />
                                        <span className='sr-only'>More options</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(chat);
                                        }}>
                                        <Edit className='mr-2 h-4 w-4' />
                                        <span>Chỉnh sửa</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(chat.id);
                                        }}>
                                        <Star className='mr-2 h-4 w-4' />
                                        <span>{chat.favorite ? 'Bỏ yêu thích' : 'Yêu thích'}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className='text-destructive focus:text-destructive'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(chat.id);
                                        }}>
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        <span>Xóa</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
