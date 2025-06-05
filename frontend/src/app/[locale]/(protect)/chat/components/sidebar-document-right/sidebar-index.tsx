'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarRailRight,
    SidebarTriggerRight
} from '@/registry/new-york-v4/ui/sidebar';

import DocumentSwitcher from './document-switcher';
import { FileList } from './file-list';
import { FileUploader } from './file-uploader';

export function DocumentSidebar() {
    return (
        <Sidebar side='right' collapsible='icon' className='overflow-hidden border-none'>
            <SidebarHeader>
                <DocumentSwitcher />
            </SidebarHeader>
            <SidebarInset>
                <SidebarTriggerRight />
            </SidebarInset>
            <SidebarContent className='overflow-hidden'>
                <FileUploader />
                <FileList />
            </SidebarContent>
            <SidebarRailRight />
        </Sidebar>
    );
}
