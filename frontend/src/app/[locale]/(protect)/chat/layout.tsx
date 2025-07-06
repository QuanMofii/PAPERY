'use client';

import { Header } from '@/components/header';

import SidebarProvider, { SidebarLeft, SidebarRight } from './components/sidebar/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-lvh w-lvw flex-col bg-white'>
            <Header />
            <div className='flex h-0 flex-1 gap-2 pb-2'>
                <SidebarProvider>
                    <SidebarLeft />
                    <main className='h-full flex-1'>{children}</main>
                    <SidebarRight />
                </SidebarProvider>
            </div>
        </div>
    );
}
