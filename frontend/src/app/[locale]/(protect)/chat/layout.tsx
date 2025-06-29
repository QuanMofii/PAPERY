'use client';

import { Header } from '@/components/header';

import SidebarProvider, { SidebarLeft, SidebarRight } from './components/sidebar-function-left/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-lvh w-lvw flex-col bg-white pr-5'>
            <Header />
            <div className='relative flex flex-1 gap-2 pb-2'>
                <SidebarProvider>
                    <SidebarLeft />
                    <main className='h-full flex-1 overflow-hidden'>{children}</main>
                    <SidebarRight />
                </SidebarProvider>
            </div>
        </div>
    );
}
