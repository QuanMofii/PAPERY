'use client';

import { ProjectSwitcher } from './project-switcher';
import { ChatList } from './chat-list';
import { ChatConfig } from './chat-config';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/registry/new-york-v4/ui/sidebar';

export function ChatSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-none overflow-hidden">
            <SidebarHeader>
                <ProjectSwitcher/>
            </SidebarHeader>
            <SidebarContent className='overflow-hidden'>
                <ChatConfig />
                <ChatList />
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
