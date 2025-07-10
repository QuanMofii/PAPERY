'use client';

import { useEffect, useState } from 'react';

import { BookOpen, EllipsisVertical, FilePen, Trash2 } from 'lucide-react';

export function FileItem({ file }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {}, [open, setOpen]);
    function handleClick() {
        setOpen(!open);
    }

    function handleClickMoveOut() {
        console.log(window);
    }

    return (
        <div className={`shadow-primary relative ml-2 flex max-h-full w-full items-center justify-between rounded-lg`}>
            <div
                className={`flex h-full w-full flex-1/2 items-center rounded-l-lg ${file.type === 'pdf' ? 'bg-orange-400' : 'bg-blue-500'} p-3`}>
                <div className={`translate-x-[-50%] -rotate-90 pt-2 font-semibold text-white uppercase`}>
                    {file.type}
                </div>
            </div>
            <div className='flex flex-1/2 flex-col items-end gap-0.5 rounded-r-lg bg-gray-500 px-1 py-2 text-white'>
                <div className='p-1 hover:rounded-full hover:bg-white hover:text-black'>
                    <BookOpen className='h-4 w-4' />
                </div>
                <div className='p-1 hover:rounded-full hover:bg-white hover:text-black'>
                    <FilePen className='h-4 w-4 hover:rounded-full hover:bg-white hover:text-black' />
                </div>
                <div className='p-1 hover:rounded-full hover:bg-white hover:text-black'>
                    <Trash2 className='h-4 w-4 hover:rounded-full hover:bg-white hover:text-black' />
                </div>
            </div>
            <div
                className={`absolute left-0 z-50 flex h-full w-[88%] justify-between gap-1 rounded-lg bg-white px-2 ${open ? '-translate-x-0.5' : 'translate-x-7.5'} transition-all`}>
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
