'use client';

import { ReactNode } from 'react';

import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from '@/registry/new-york-v4/ui/sidebar';


interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SidebarProvider>
            <div className='flex min-h-screen'>
                {/* Sidebar */}
                <Sidebar collapsible='icon'>
                    
                    <SidebarRail />
                </Sidebar>

                {/* Main Content */}
                <SidebarInset className='flex flex-1 flex-col'>
                    {/* Dashboard Header */}


                    {/* Page Content */}
                    <main className='flex-1 overflow-auto'>
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
