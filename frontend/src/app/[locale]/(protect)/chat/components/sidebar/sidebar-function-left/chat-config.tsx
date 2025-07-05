'use client';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/registry/new-york-v4/ui/sidebar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog";
import { Package, Settings2, SquareTerminal, TrainFront } from 'lucide-react';
import { ModelsDialog } from './dialog/models-dialog';
import { AgentsDialog } from './dialog/agents-dialog';
import { SettingsDialog } from './dialog/settings-dialog';

// TODO: Thay thế bằng API call để lấy các nav items
const config_item = [
    { title: 'Models', icon: Package, dialog: ModelsDialog },
    { title: 'Agents', icon: TrainFront, dialog: AgentsDialog },
    { title: 'Settings', icon: Settings2, dialog: SettingsDialog }
];

export function ChatConfig() {
    return (
        <SidebarGroup >
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {config_item.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <Dialog>
                            <DialogTrigger asChild>
                                <SidebarMenuButton tooltip={item.title}>
                                    <div className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>

                                    </div>
                                </SidebarMenuButton>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{item.title}</DialogTitle>
                                </DialogHeader>
                                <item.dialog />
                            </DialogContent>
                        </Dialog>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
