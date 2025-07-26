'use client';

import { useState } from 'react';

import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';

import { FileItem } from './file-list-item';
import { Trash2 } from 'lucide-react';

// Mock data cho danh sách file
const mockFiles = [
    { id: 1, name: 'document1.pdf', type: 'pdf', size: '2.5MB', date: '2024-03-20' },
    { id: 2, name: 'report.docx', type: 'docx', size: '1.8MB', date: '2024-03-19' },
    { id: 3, name: 'contract.pdf', type: 'pdf', size: '3.2MB', date: '2024-03-18' },
    { id: 4, name: 'presentation.pdf', type: 'pdf', size: '3.7MB', date: '2024-03-18' },
    { id: 5, name: 'analysis.docx', type: 'docx', size: '2.1MB', date: '2024-03-17' },
    { id: 6, name: 'guidelines.pdf', type: 'pdf', size: '4.2MB', date: '2024-03-17' },
    { id: 7, name: 'research.docx', type: 'docx', size: '1.5MB', date: '2024-03-16' },
    { id: 8, name: 'summary.pdf', type: 'pdf', size: '2.8MB', date: '2024-03-16' },
    { id: 9, name: 'proposal.docx', type: 'docx', size: '3.1MB', date: '2024-03-15' },
    { id: 10, name: 'report2.pdf', type: 'pdf', size: '2.9MB', date: '2024-03-15' }
];

export function FileList() {
    const [selectAll, setSelectAll] = useState(false);

    return (
        <div className='h-full flex-1 overflow-hidden rounded-lg p-4'>
            <div className='flex w-full items-center justify-between p-2 text-sm font-medium'>
                Library
                <div className='flex items-center gap-2'>
                    <div
                        className={`rounded-full p-1 transition-all hover:bg-red-500 ${selectAll ? 'visible' : 'invisible'}`}>
                        <Trash2 className='h-5 w-5 text-red-600 hover:text-white' />
                    </div>
                    <Checkbox
                        onCheckedChange={() => setSelectAll(!selectAll)}
                        className='h-5 w-5 border-stone-500 ring-stone-500 data-[state=checked]:border-stone-500'
                    />
                </div>
            </div>
            <div className='flex h-full flex-col gap-2 overflow-y-scroll p-2'>
                {mockFiles.map((file) => (
                    <FileItem key={file.id} file={file} />
                ))}
            </div>
        </div>
    );
}
