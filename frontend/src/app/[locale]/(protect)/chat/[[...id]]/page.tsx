'use server';

import ChatIndex from '../components/chat-arena/chat-arena-index';
import { DocumentViewIndex } from '../components/document-view/document-view-index';

const ChatPage = () => {
    return (
        <>
            <div className='mb-5 flex h-full w-full flex-row items-center justify-center gap-x-5 overflow-hidden'>
                <div className='flex h-full w-full items-center justify-center rounded-lg bg-[#f2fbff]'>
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
