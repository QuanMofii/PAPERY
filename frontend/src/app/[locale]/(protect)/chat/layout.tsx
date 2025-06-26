'use client';

import { Header } from '@/components/header';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTriggerLeft,
    SidebarTriggerRight
} from '@/registry/new-york-v4/ui/sidebar';
import { Dialog } from '@radix-ui/react-dialog';

import SidebarRight from './components/sidebar-document-right/sidebar';
import { DocumentSidebar } from './components/sidebar-document-right/sidebar-index';
import { AgentsDialog } from './components/sidebar-function-left/dialog/agents-dialog';
import { ModelsDialog } from './components/sidebar-function-left/dialog/models-dialog';
import { SettingsDialog } from './components/sidebar-function-left/dialog/settings-dialog';
import { SidebarItem, SidebarLeft } from './components/sidebar-function-left/sidebar';
import { ChatSidebar } from './components/sidebar-function-left/sidebar-index';
import { MessageCircleMore, Package, Settings2, TrainFront } from 'lucide-react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        // <SidebarProvider>
        //     <ChatSidebar />
        //     <SidebarInset>
        //         <div className='flex w-full flex-row items-center justify-between px-2'>
        //             <SidebarTriggerLeft />
        //             <Header />
        //             <SidebarTriggerRight />
        //         </div>
        //         <main className='h-full w-full flex-1 overflow-hidden px-2 pb-2'>{children}</main>
        //     </SidebarInset>
        //     <DocumentSidebar />
        // </SidebarProvider>
        <div className='bg-linear-to-r from-[#577e8d] to-[#728b92] px-5'>
            <Header />
            <div className='relative flex'>
                <SidebarLeft />
                <main className='h-full flex-1 overflow-hidden px-2 pb-2'>{children}</main>
                <SidebarRight />
            </div>
        </div>
    );
}
