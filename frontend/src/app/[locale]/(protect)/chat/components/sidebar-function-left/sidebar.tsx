'use client';

import { createContext, useContext, useState } from 'react';

import {
    Briefcase,
    ChevronRight,
    History,
    MessageCircleMore,
    Package,
    Settings2,
    Star,
    TrainFront
} from 'lucide-react';

// const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

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
const config_item = [
    { title: 'Models', icon: Package },
    { title: 'Agents', icon: TrainFront },
    { title: 'Settings', icon: Settings2 },
    { title: 'History Chat', icon: MessageCircleMore }
];

export function SidebarLeft() {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className='flex h-full'>
            <nav className='flex h-full w-20 flex-col rounded-lg bg-transparent'>
                <div className='flex w-full cursor-pointer items-center justify-between rounded-xl p-6 pb-6 transition-all duration-200'>
                    <div className='flex size-8 items-center justify-center rounded-lg bg-white text-[#728b92]'>
                        <Briefcase className='size-4' />
                    </div>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                    <ul>
                        {config_item.map((item) => (
                            <li
                                key={item.title}
                                className='group relative m-2 flex flex-col items-center gap-2 px-4 py-4 text-white hover:rounded-lg hover:bg-[#424242]]'>
                                <div className={`px-1 transition-all duration-2 group-hover:-translate-y-2`}>
                                    <item.icon />
                                </div>
                                <div className='absolute bottom-2 hidden truncate text-center text-xs group-hover:block'>
                                    {item.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={() => setExpanded((expanded) => !expanded)}>toggle</button>
            </nav>
            <div className='flex h-full rounded-lg bg-[#f2fbff]'>
                <div className={`overflow-hidden transition-all ${expanded ? 'ml-2 w-50' : 'm-0 w-0'}`}>
                    {HISTORY_ITEMS.map((item) => (
                        <div key={item.title} className='flex items-center justify-between px-2 py-4 text-lg'>
                            <div className='flex items-center gap-1'>
                                {item.icon}
                                <div>{item.title}</div>
                            </div>
                            <ChevronRight />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
