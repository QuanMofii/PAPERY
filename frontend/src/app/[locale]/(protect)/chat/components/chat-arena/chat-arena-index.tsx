'use client';

import { useState } from 'react';

import { useParams, useRouter, useSearchParams } from 'next/navigation';

import useCreate from '@/hooks/use-create';
import useQuery from '@/hooks/use-query';
import { type Message } from '@/registry/new-york-v4/ui/chat-message';
import { useListChatStore } from '@/store/chat-list.store';

import { Chat } from './chat-ui';
import { ParkingMeter } from 'lucide-react';

interface ChatSubmitEvent {
    preventDefault?: () => void;
}

interface ChatSubmitOptions {
    experimental_attachments?: FileList;
}

type ChatSubmitHandler = (event?: ChatSubmitEvent, options?: ChatSubmitOptions) => void;
export default function ChatIndex() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { chats, setChats } = useListChatStore();
    const param = useParams();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('projectId');
    const [query] = useQuery({ project_uuid: projectId });

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (event?: ChatSubmitEvent, options?: { experimental_attachments?: FileList }) => {
        event?.preventDefault?.();
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        if (!param.id) {
            await useCreate(
                'chat-sessions',
                {
                    title: userMessage.content
                },
                chats,
                setChats,
                'chat',
                query
            );
            // router.push(`/chat/${param.id}?projectId=${projectId}`);
        }

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsGenerating(true);

        // try {
        //     const response = await fetch('/api/chat', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ messages: newMessages, input })
        //     });

        //     const data = await response.json();

        //     const assistantMessage: Message = {
        //         id: data.id,
        //         role: 'assistant',
        //         content: data.content
        //     };

        //     setMessages((prev) => [...prev, assistantMessage]);
        // } catch (err) {
        //     console.error('Failed to get response', err);
        // } finally {
        //     setIsGenerating(false);
        // }
    };

    return (
        <Chat
            messages={messages}
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            isGenerating={isGenerating}
            setMessages={setMessages}
            className='h-full w-[50%] rounded-2xl px-2'
        />
    );
}
