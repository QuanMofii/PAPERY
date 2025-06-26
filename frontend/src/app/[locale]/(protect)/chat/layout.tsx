import { Header } from '@/components/header';

import SidebarRight from './components/sidebar-document-right/sidebar';
import { SidebarLeft } from './components/sidebar-function-left/sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-lvh w-lvw flex-col bg-linear-to-r from-[#577e8d] to-[#728b92] px-5'>
            <Header />
            <div className='relative flex flex-1 gap-2 pb-2'>
                <SidebarLeft />
                <main className='h-full flex-1 overflow-hidden'>{children}</main>
                <SidebarRight />
            </div>
        </div>
    );
}
