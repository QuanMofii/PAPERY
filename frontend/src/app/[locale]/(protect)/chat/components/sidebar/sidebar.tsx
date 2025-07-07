'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { FileList } from './sidebar-document-right/file-list';
import { FileUploader } from './sidebar-document-right/file-uploader';
import { ChatList } from './sidebar-function-left/chat-list';
import {
    Briefcase,
    ChevronRight,
    History,
    MessageCircleMore,
    Package,
    PanelLeft,
    PanelRight,
    Settings2,
    Star,
    TrainFront
} from 'lucide-react';

interface ChatItem {
    id: string;
    title: string;
    updatedAt: string;
    createdAt: string;
    projectId: string;
    favorite: boolean;
}

const config_item = [
    { title: 'Models', icon: Package },
    { title: 'Agents', icon: TrainFront },
    { title: 'Settings', icon: Settings2 },
    { title: 'History Chat', icon: MessageCircleMore }
];

type SidebarContext = {
    expandedLeft: boolean;
    expandedRight: boolean;
    setExpandedLeft: (open: boolean) => void;
    setExpandedRight: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContext | null>(null);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }

    return context;
}

export default function SidebarProvider({ children }: { children: ReactNode }) {
    const [expandedLeft, setExpandedLeft] = useState(true);
    const [expandedRight, setExpandedRight] = useState(true);

    const context: SidebarContext = {
        expandedLeft,
        expandedRight,
        setExpandedLeft,
        setExpandedRight
    };

    return <SidebarContext.Provider value={context}>{children}</SidebarContext.Provider>;
}

export function SidebarTrigger({ side, className }: { side: string; className: string }) {
    const { expandedLeft, expandedRight, setExpandedLeft, setExpandedRight } = useSidebar();

    function handleClick() {
        if (side === 'left') {
            setExpandedLeft(!expandedLeft);
        } else {
            setExpandedRight(!expandedRight);
        }
    }

    return (
        <button className={className} onClick={handleClick}>
            {side === 'left' ? <PanelLeft /> : <PanelRight />}
        </button>
    );
}

export function SidebarLeft() {
    const { expandedLeft } = useSidebar();

    return (
        <div className='flex h-full'>
            <nav className='flex h-full w-20 flex-col rounded-lg bg-transparent'>
                <div className='flex w-full cursor-pointer items-center justify-between rounded-xl p-6 pb-6 transition-all duration-200'>
                    <div className='flex size-8 items-center justify-center rounded-lg text-gray-600'>
                        <Briefcase className='size-4' />
                    </div>
                </div>
                <div className='flex flex-1 items-center justify-center'>
                    <ul>
                        {config_item.map((item) => (
                            <li
                                key={item.title}
                                className='group relative m-2 flex flex-col items-center gap-2 px-4 py-4 text-gray-600 hover:rounded-lg hover:bg-[#424242]'>
                                <div className={`px-1 transition-all duration-200 group-hover:-translate-y-2`}>
                                    <item.icon />
                                </div>
                                <div className='absolute bottom-2 hidden truncate text-center text-xs group-hover:block'>
                                    {item.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className='flex h-full rounded-lg bg-white shadow-sm'>
                <div className={`overflow-hidden transition-all ${expandedLeft ? 'ml-2 w-50' : 'm-0 w-0'}`}>
                    <ChatList />
                </div>
            </div>
        </div>
    );
}

export function SidebarRight() {
    const { expandedRight } = useSidebar();

    return (
        <div
            className={`h-full transition-all ${expandedRight ? 'visible w-80' : 'invisible w-0'} rounded-lg bg-white pr-5`}>
            <div className={`${expandedRight ? 'block' : 'hidden'} flex h-full flex-col`}>
                <FileUploader />
                <FileList />
            </div>
        </div>
    );
}
