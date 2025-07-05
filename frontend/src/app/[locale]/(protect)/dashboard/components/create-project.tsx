'use client';

import { useState } from 'react';

import { ProjectDialogContent } from '@/components/project-dialog';
import useCreate from '@/hooks/use-create';
import useNotification from '@/hooks/use-notification';
import { Dialog, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import { useListProjectStore } from '@/store/project-list.store';

import { Plus } from 'lucide-react';

export function CreateProjectCard() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { projects, setProjects } = useListProjectStore();

    const handleCreateProject = async (data: { name: string; description: string }) => {
        setIsLoading(true);
        const response = await useCreate('projects', data, projects, setProjects);

        if (response.success) {
            setIsOpen(false);
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className='group border-border hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-lg border border-dashed bg-white transition-all hover:shadow-md'>
                    <div className='bg-primary/15 absolute -top-10 -right-10 h-20 w-20 rotate-12 transition-all duration-300 group-hover:scale-150'></div>
                    <div className='bg-primary/15 absolute -bottom-10 -left-10 h-20 w-20 rotate-12 transition-all duration-300 group-hover:scale-150'></div>
                    <div className='relative z-10 flex h-full flex-col items-center justify-center p-6 text-center'>
                        <div className='bg-primary/10 group-hover:bg-primary/20 mb-4 rounded-full p-3 transition-transform duration-300 group-hover:scale-110'>
                            <Plus className='text-primary h-6 w-6' />
                        </div>
                        <h3 className='text-lg font-medium'>Tạo dự án mới</h3>
                        <p className='text-muted-foreground mt-2 text-sm'>Bắt đầu một dự án mới với Papery</p>
                    </div>
                </div>
            </DialogTrigger>
            <ProjectDialogContent
                title='Tạo dự án mới'
                description='Nhập thông tin cho dự án mới của bạn'
                onSubmit={handleCreateProject}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                isLoading={isLoading}
            />
        </Dialog>
    );
}
