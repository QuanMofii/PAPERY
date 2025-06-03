'use client';

import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/registry/new-york-v4/ui/button';

// Mock data cho danh sách file
const mockFiles = [
    { id: 1, name: 'document1.pdf', type: 'pdf', size: '2.5MB', date: '2024-03-20' },
    { id: 2, name: 'report.docx', type: 'docx', size: '1.8MB', date: '2024-03-19' },
    { id: 3, name: 'contract.pdf', type: 'pdf', size: '3.2MB', date: '2024-03-18' },
];

export function FileList() {
    return (
        <div className="p-4">
            <h3 className="text-sm font-medium mb-3">Tài liệu đã tải lên</h3>
            <div className="space-y-2">
                {mockFiles.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100"
                    >
                        <div className="flex items-center space-x-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {file.size} • {file.date}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => console.log('Delete file:', file.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
