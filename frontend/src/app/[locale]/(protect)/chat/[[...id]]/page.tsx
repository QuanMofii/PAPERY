'use server';

import ChatIndex from '../components/chat-arena/chat-arena-index';
import HeaderChat from '../components/chat-arena/header-chat';
import { DocumentViewIndex } from '../components/document-view/document-view-index';
import { SidebarTrigger } from '../components/sidebar/sidebar';

const ChatPage = () => {
    return (
        <>
            <div className='mb-5 flex h-full w-full flex-col items-center justify-center gap-x-5 overflow-hidden'>
                <div className='relative flex h-full w-full flex-col items-center justify-center rounded-lg bg-[#ebeef3] shadow-sm'>
                    <div className='flex w-full p-4'>
                        <SidebarTrigger side='left' className='text-gray-500' />
                        <HeaderChat />
                        <SidebarTrigger side='right' className='text-gray-500' />
                    </div>
                    <ChatIndex />
                </div>
                {/* <div className='h-full w-1/2 rounded-lg bg-blue-500'>
                    <DocumentViewIndex />
                </div> */}
            </div>
        </>
    );
};

export default ChatPage;
