'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarRailRight } from '@/registry/new-york-v4/ui/sidebar';

import DocumentHeader from './document-header';
import { FileList } from './file-list';
import { FileUploader } from './file-uploader';
import { FileText } from 'lucide-react';

export function DocumentSidebar() {
    return (
        <Sidebar side='right' collapsible='offcanvas' className='overflow-hidden border-none'>
            <SidebarHeader>
                <DocumentHeader />
            </SidebarHeader>

            <SidebarContent className='overflow-hidden'>
                <FileUploader />
                <FileList />
            </SidebarContent>
            <SidebarRailRight />
        </Sidebar>
    );
}
