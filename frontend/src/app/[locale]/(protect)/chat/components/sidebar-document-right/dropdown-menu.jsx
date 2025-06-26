'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';

//icon
import { BookOpen, EllipsisVertical, FilePen, Trash2 } from 'lucide-react';

export function DropdownMenuNav({ setIsDropDownOpen, isDropDownOpen, setShowControls }) {
    function handleClick(e) {
        e.stopPropagation();
        setIsDropDownOpen((open) => !open);
    }

    const handleOpenChange = (open) => {
        setIsDropDownOpen(open);
        if (!open) {
            setShowControls(false);
        }
    };

    return (
        <DropdownMenu open={isDropDownOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger
                onClick={handleClick}
                className='flex h-full w-full items-center justify-center border-none text-stone-500'></DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[200px]'>
                <DropdownMenuGroup className='text-primary'>
                    <DropdownMenuItem className='flex items-center gap-2 px-3 py-2'>
                        <BookOpen className='h-4 w-4' />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2 px-3 py-2'>
                        <FilePen className='h-4 w-4' />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem className='flex items-center gap-2 px-3 py-2'>
                        <Trash2 className='h-4 w-4' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
