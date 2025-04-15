'use client';

import { Header } from '@/components/header';
import { ChatSidebar } from './components/sidebar/sidebar';
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
            <div className="w-full flex items-center justify-between flex-row">
            <SidebarTrigger />
            <Header />
            </div>

            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </SidebarInset>
        </SidebarProvider>
    );
}
