'use client';

import { useParams } from 'next/navigation';

import useGet from '@/hooks/use-get';

export default function HeaderChat() {
    const param: { id: string[] } = useParams();
    let chat: any = null;
    if (param.id) {
        chat = useGet('chat-sessions', param.id);
    }

    return <div className='flex-1 text-center'>{chat?.title}</div>;
}
