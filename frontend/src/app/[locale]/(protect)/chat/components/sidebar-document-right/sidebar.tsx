'use client';

import { useState } from 'react';

import { FileList } from './file-list';
import { FileUploader } from './file-uploader';

export default function SidebarRight() {
    const [open, setOpen] = useState(true);

    return (
        <div
            className={`h-[90vh] overflow-hidden transition-all ${open ? 'visible w-80' : 'invisible w-0'} rounded-lg bg-white`}>
            <div className={`${open ? 'block' : 'hidden'}`}>
                <div>
                    <FileUploader />
                </div>
                <div>
                    <FileList />
                </div>
                <button onClick={(open) => setOpen(!open)}>Toggle</button>
            </div>
        </div>
    );
}
