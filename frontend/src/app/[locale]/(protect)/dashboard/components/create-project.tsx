'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Dialog, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { Plus } from 'lucide-react';
import { CreateProjectAPI } from '@/app/api/client/project-list.api';
import { ProjectDialogContent } from '@/components/project-dialog';

export function CreateProjectCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCreateProject = async (data: { name: string; description: string }) => {
        setIsLoading(true);
        const response = await CreateProjectAPI({
            title: data.name,
            description: data.description
        });

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success
                ? 'Project created successfully'
                : response.error?.message || 'Failed to create project',
            duration: 2000
        });

        if (response.success) {
            setIsOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="group relative overflow-hidden rounded-lg border border-dashed border-border bg-white transition-all hover:border-primary/50 hover:shadow-md cursor-pointer">
                    <div className="absolute -right-10 -top-10 h-20 w-20 rotate-12 bg-primary/15 transition-all duration-300 group-hover:scale-150"></div>
                    <div className="absolute -left-10 -bottom-10 h-20 w-20 rotate-12 bg-primary/15 transition-all duration-300 group-hover:scale-150"></div>
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 rounded-full bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                            <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">Tạo dự án mới</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Bắt đầu một dự án mới với Papery</p>
                    </div>
                </div>
            </DialogTrigger>
            <ProjectDialogContent
                title="Tạo dự án mới"
                description="Nhập thông tin cho dự án mới của bạn"
                onSubmit={handleCreateProject}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                isLoading={isLoading}
            />
        </Dialog>
    );
}
