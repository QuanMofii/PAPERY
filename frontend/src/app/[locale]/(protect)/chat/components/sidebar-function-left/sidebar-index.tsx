'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRailLeft } from '@/registry/new-york-v4/ui/sidebar';

import { ChatConfig } from './chat-config';
import { ChatList } from './chat-list';
import { ProjectSwitcher } from './project-switcher';

export function ChatSidebar() {
    return (
        <Sidebar collapsible='icon' className='overflow-hidden border-none'>
            <SidebarHeader>
                <ProjectSwitcher />
            </SidebarHeader>
            <SidebarContent className='overflow-hidden'>
                <ChatConfig />
                <ChatList />
            </SidebarContent>
            <SidebarRailLeft />
        </Sidebar>
    );
}
