import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/registry/new-york-v4/ui/sidebar';

import { FileText } from 'lucide-react';

export default function DocumentHeader() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                    <div className='bg-primary hover:bg-primary/90 text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                        <FileText className='size-4' />
                    </div>
                    <div>
                        <p>Tài Liệu</p>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
