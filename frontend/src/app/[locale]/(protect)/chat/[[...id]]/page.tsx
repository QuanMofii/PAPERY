'use server';

import ChatIndex from '../components/chat-arena/chat-arena-index';
import { DocumentViewIndex } from '../components/document-view/document-view-index';
import { SidebarTrigger } from '../components/sidebar-function-left/sidebar';

const ChatPage = () => {
    return (
        <>
            <div className='mb-5 flex h-full w-full flex-row items-center justify-center gap-x-5 overflow-hidden'>
                <div className='relative flex h-full w-full items-center justify-center rounded-lg bg-[#ebeef3] shadow-sm'>
                    <SidebarTrigger side='left' className='absolute top-0 left-0 text-gray-500' />
                    <ChatIndex />
                    <SidebarTrigger side='right' className='absolute top-0 right-0 text-gray-500' />
                </div>
                {/* <div className='h-full w-1/2 rounded-lg bg-blue-500'>
                    <DocumentViewIndex />
                </div> */}
            </div>
        </>
    );
};

export default ChatPage;
