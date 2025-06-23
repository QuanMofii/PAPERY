import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';

import { Briefcase, ChevronRight, ChevronsUpDown, History, Star } from 'lucide-react';

const SidebarContext = createContext<{ expanded: boolean }>({ expanded: true });

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

export function Sidebar({ children }: { children: ReactNode }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <SidebarContext.Provider value={{ expanded }}>
            <div className='absolute'>
                <div className='flex h-[90vh] rounded-lg bg-white p-1'>
                    <nav className='flex h-full flex-col rounded-lg bg-amber-300 shadow-sm ring-1 ring-amber-400'>
                        <div className='flex w-full cursor-pointer items-center justify-between rounded-xl p-4 pb-4 transition-all duration-200 hover:bg-white/90'>
                            <div className='flex size-8 items-center justify-center rounded-lg bg-white text-black hover:bg-white/90'>
                                <Briefcase className='size-4' />
                            </div>
                            {/* <div
                        className={`flex items-center justify-center overflow-hidden transition-all ${expanded ? 'w-40' : 'w-0'}`}>
                        <div className='grid flex-1 pl-2 text-left text-sm leading-tight'>
                            <span className='truncate font-medium'>{selectedProject?.title || ''}</span>
                            <span className='truncate text-xs'>{selectedProject?.description || ''}</span>
                            <span className='truncate font-medium'>adfafasdfasdfasdf</span>
                            <span className='truncate text-xs'>adfasdfasdfadfaff</span>
                            </div>
                            <ChevronsUpDown className='ml-auto' />
                            </div> */}
                        </div>
                        <ul className='mt-[25vh]'>{children}</ul>
                        <button onClick={() => setExpanded((expanded) => !expanded)}>toggle</button>
                    </nav>
                    <div className={`overflow-hidden transition-all ${expanded ? 'ml-2 w-45' : 'm-0 w-0'}`}>
                        {HISTORY_ITEMS.map((item) => (
                            <>
                                <div key={item.title} className='flex items-center justify-between text-lg'>
                                    <div className='flex items-center gap-1'>
                                        {item.icon}
                                        <div>{item.title}</div>
                                    </div>
                                    <ChevronRight />
                                </div>
                                <div></div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarContext.Provider>
    );
}

export function SidebarItem({
    id,
    icon,
    title,
    dialog = null
}: {
    id: number;
    icon: ReactNode;
    title: string;
    dialog: ReactNode;
}) {
    const { expanded } = useContext(SidebarContext);

    return (
        <li key={id} className='group flex items-center gap-2 px-4 py-2'>
            <div className={`px-1`}>{icon}</div>
            {!expanded ? (
                <div className='invisible absolute left-full ml-2 -translate-x-3 rounded-lg bg-white px-2 py-1 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100'>
                    {title}
                </div>
            ) : null}
        </li>
    );
}
