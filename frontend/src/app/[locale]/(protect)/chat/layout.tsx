'use client';

import { Header } from '@/components/header';
import { ChatSidebar } from './components/sidebar-function-left/sidebar-index';
import { DocumentSidebar } from './components/sidebar-document-right/sidebar-index';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar';

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
        <ChatSidebar />
        <SidebarInset>
            <div className="w-full flex items-center justify-between flex-row px-2">
            <SidebarTrigger />
            <Header />
            </div>
            <main className="flex-1 overflow-hidden w-full h-full pb-2  px-2">
                {children}
            </main>
        </SidebarInset>
        </SidebarProvider>
    );
}
