'use client';

import { FileUploader } from './file-uploader';
import { FileList } from './file-list';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail, SidebarInset, SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar';

export function DocumentSidebar() {
    return (
        <Sidebar collapsible="icon" className="border-none overflow-hidden">
            <SidebarHeader>
                <h2 className="text-lg font-semibold">Tài liệu</h2>
            </SidebarHeader>
            <SidebarContent className='overflow-hidden'>
                <FileUploader />
                <FileList />
            </SidebarContent>
            <SidebarRail />
            <SidebarInset>
                <div className="w-full flex items-center justify-end px-2">
                    <SidebarTrigger />
                </div>
            </SidebarInset>
        </Sidebar>
    );
}
