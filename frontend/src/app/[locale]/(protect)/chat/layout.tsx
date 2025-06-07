'use client';

import { Header } from '@/components/header';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTriggerLeft,
    SidebarTriggerRight
} from '@/registry/new-york-v4/ui/sidebar';

import { DocumentSidebar } from './components/sidebar-document-right/sidebar-index';
import { ChatSidebar } from './components/sidebar-function-left/sidebar-index';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <ChatSidebar />
            <SidebarInset>
                <div className='flex w-full flex-row items-center justify-between px-2'>
                    <SidebarTriggerLeft />
                    <Header />
                    <SidebarTriggerRight />
                </div>
                <main className='h-full w-full flex-1 overflow-hidden px-2 pb-2'>{children}</main>
            </SidebarInset>
            <DocumentSidebar />
        </SidebarProvider>
    );
}
