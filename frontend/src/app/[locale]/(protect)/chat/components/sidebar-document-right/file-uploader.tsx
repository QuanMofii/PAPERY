'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/registry/new-york-v4/ui/button';

import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const ACCEPTED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

export function FileUploader() {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        maxSize: 10 * 1024 * 1024 // 10MB
    });
    console.log(files);

    return (
        <div className='p-4'>
            <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary border-gray-300'}`}>
                <input {...getInputProps()} />
                <Upload className='mx-auto h-12 w-12 text-gray-400' />
                <p className='mt-2 text-sm text-gray-600'>
                    {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file vào đây hoặc click để chọn file'}
                </p>
                <p className='mt-1 text-xs text-gray-500'>Hỗ trợ: PDF, DOCX (Tối đa 10MB)</p>
            </div>
        </div>
    );
}
