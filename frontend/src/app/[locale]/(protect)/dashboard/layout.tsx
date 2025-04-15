'use client';

import { ReactNode } from 'react';
import { Header } from "@/components/header"
import Link from 'next/link';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className='flex min-h-screen max-h-full flex-col bg-[var(--page-background)] w-full'>
            <div className="w-full border-b fixed top-0">
                <div className="container flex items-center fixed top-0 left-0 right-0 bg-white z-10">
                    <Link href="/" className="text-2xl font-bold text-primary mr-4">
                        Papery
                    </Link>
                    <Header />
                </div>
            </div>
            <main className='flex-1 container h-full'>
                {children}
            </main>
        </div>
    );
}
