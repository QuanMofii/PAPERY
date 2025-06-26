'use client';

import { useState } from 'react';

import { FileList } from './file-list';
import { FileUploader } from './file-uploader';

export default function SidebarRight() {
    const [open, setOpen] = useState(true);

    return (
        <div
            className={`h-full overflow-hidden transition-all ${open ? 'visible w-80' : 'invisible w-0'} rounded-lg bg-[#f2fbff]`}>
            <div className={`${open ? 'block' : 'hidden'}`}>
                <FileUploader />
                <FileList />
                <button onClick={(open) => setOpen(!open)}>Toggle</button>
            </div>
        </div>
    );
}
