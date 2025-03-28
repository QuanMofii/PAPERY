"use client";

import { useState } from 'react';
import { ChatInterface } from '@/components/dashboard/feature/chat/chatbot';
import { FileList } from '@/components/dashboard/feature/chat/file-list';
import { FileFilterSidebar } from '@/components/dashboard/feature/chat/file-sidebar';

export default function ChatPage() {
    const [showFileList, setShowFileList] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'pdf' | 'document' | 'text' | 'image'>('all');

    return (
        <div className='flex h-full gap-4 p-4'>
            {/* Chat Interface - 40% */}
            <div className='w-[40%]'>
                <ChatInterface />
            </div>

            {/* File List - 40% (conditionally rendered) */}
            {showFileList && (
                <div className='w-[40%]'>
                    <FileList />
                </div>
            )}

            {/* File Sidebar - remaining width */}
            <div className='flex-shrink-0'>
                <FileFilterSidebar
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    showFileList={showFileList}
                    setShowFileList={setShowFileList}
                />
            </div>
        </div>
    );
}
