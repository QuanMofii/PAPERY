'use client';

import { useEffect, useState } from 'react';

import { BookOpen, EllipsisVertical, FilePen, Trash2 } from 'lucide-react';

export function FileItem({ file }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(open);
    }, [open, setOpen]);
    function handleClick() {
        setOpen(!open);
    }

    return (
        <div
            className={`relative flex max-h-full w-full items-center justify-between rounded-lg ${file.type === 'pdf' ? 'bg-orange-400' : 'bg-blue-500'} `}>
            <div
                className={`ml-2 flex h-16 w-6 items-center ${file.type === 'pdf' ? 'bg-orange-400' : 'bg-blue-500'} p-2`}>
                <div className={`translate-x-[-50%] -rotate-90 font-semibold text-white uppercase`}>{file.type}</div>
            </div>
            <div className='flex flex-col gap-2 rounded-r-lg bg-gray-500 px-3 py-2 text-white'>
                <BookOpen className='h-4 w-4' />
                <FilePen className='h-4 w-4' />
                <Trash2 className='h-4 w-4' />
            </div>
            <div
                className={`absolute right-0 z-50 flex h-full w-[92%] justify-between gap-1 rounded-lg bg-white px-2 ${open ? '-translate-x-7' : 'translate-x-1'} transition-all`}>
                <div className='flex flex-col justify-center'>
                    <p className='text-sm font-medium text-stone-700'>{file.name}</p>
                    <p className='text-xs text-gray-500'>{file.size}</p>
                </div>
                <div className={`inset-0 transition-opacity duration-200`}>
                    <div
                        onClick={handleClick}
                        className='flex h-full w-full cursor-pointer items-center justify-center border-none text-stone-500'>
                        <EllipsisVertical className='h-5 w-5' />
                    </div>
                </div>
            </div>
        </div>
    );
}
