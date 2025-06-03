"use server"
import ChatIndex from "../components/chat-arena/chat-arena-index"
import { DocumentViewIndex } from "../components/document-view/document-view-index";
const ChatPage = () => {
    return (
        <>
        <div className="flex flex-row w-full h-full gap-x-5 mb-5 overflow-hidden">
            <div className="w-1/2 h-full bg-accent/20 rounded-lg p-10">
                <ChatIndex />
            </div>
            <div className="w-1/2 h-full bg-blue-500 rounded-lg">
            <DocumentViewIndex />
            </div>
        </div>
        </>
    );
};

export default ChatPage;
