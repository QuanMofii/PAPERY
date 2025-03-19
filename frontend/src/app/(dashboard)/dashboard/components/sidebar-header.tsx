'use client';

import { getCurrentUser } from '@/actions/user-action';
import { TeamSwitcher } from '@/registry/new-york-v4/blocks/sidebar-07/components/team-switcher';
import { Label } from '@/registry/new-york-v4/ui/label';
import { SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarInput } from '@/registry/new-york-v4/ui/sidebar';

import { AudioWaveform, Command, GalleryVerticalEnd, Search } from 'lucide-react';

const teams = [
    {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise'
    },
    {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup'
    },
    {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free'
    }
];

export function DashboardSidebarHeader() {
    return (
        <SidebarHeader>
            <TeamSwitcher teams={teams} />
            <SidebarGroup className='py-0 group-data-[collapsible=icon]:hidden'>
                <SidebarGroupContent>
                    <form className='relative'>
                        <Label htmlFor='search' className='sr-only'>
                            Search
                        </Label>
                        <SidebarInput id='search' placeholder='Search the docs...' className='pl-8' />
                        <Search className='pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none' />
                    </form>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarHeader>
    );
}
