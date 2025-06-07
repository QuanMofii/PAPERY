import { useEffect, useRef, useState } from 'react';

import { Checkbox } from '@/registry/new-york-v4/ui/checkbox';

import { DropdownMenuNav } from './dropdown-menu';
import { FileIcon } from './file-icon';

export function FileItem({ file }) {
    const [showControls, setShowControls] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const itemRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (itemRef.current && !itemRef.current.contains(event.target) && isDropDownOpen) {
                setIsDropDownOpen(false);
                setShowControls(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropDownOpen]);

    return (
        <div
            ref={itemRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => {
                if (!isDropDownOpen) {
                    setShowControls(false);
                }
            }}
            className='file flex items-center justify-between rounded-lg p-2 hover:bg-gray-100'>
            <div className='flex items-center space-x-2 p-2'>
                <div className='relative h-5 w-5'>
                    <div
                        className={`absolute inset-0 transition-opacity duration-200 ${showControls || isDropDownOpen ? 'opacity-0' : 'opacity-100'}`}>
                        <FileIcon file={file} />
                    </div>
                    <div
                        className={`absolute inset-0 transition-opacity duration-200 ${showControls || isDropDownOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <DropdownMenuNav
                            isDropDownOpen={isDropDownOpen}
                            setIsDropDownOpen={setIsDropDownOpen}
                            setShowControls={setShowControls}
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-1'>
                    <p className='text-sm font-medium'>{file.name}</p>
                    <p className='text-xs text-gray-500'>{file.size}</p>
                </div>
            </div>
            <Checkbox className='h-5 w-5 border-stone-500 ring-stone-500 data-[state=checked]:border-stone-500' />
        </div>
    );
}
