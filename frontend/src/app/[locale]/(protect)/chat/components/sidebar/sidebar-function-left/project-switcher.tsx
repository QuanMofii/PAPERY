'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { CreateProjectAPI, GetAllProjectsAPI } from '@/app/api/client/project-list.api';
import { ProjectDialogContent } from '@/components/project-dialog';
import { Dialog, DialogTrigger } from '@/registry/new-york-v4/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/registry/new-york-v4/ui/sidebar';
import { Skeleton } from '@/registry/new-york-v4/ui/skeleton';
import { ProjectType } from '@/schemas/project-list.schemas';
import { useListProjectStore } from '@/store/project-list.store';

import { Briefcase, ChevronsUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function ProjectSwitcher() {
    const router = useRouter();
    // const { isMobile } = useSidebar();
    const searchParams = useSearchParams();
    const { projects, selectedProject, setSelectedProject, setProjects } = useListProjectStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const projectId = searchParams.get('projectId');

    useEffect(() => {
        setIsLoading(true);
        if (!projectId) {
            router.push('/dashboard');

            return;
        }

        if (selectedProject?.id === projectId) {
            setIsLoading(false);

            return;
        }

        const fetchProjects = async () => {
            const response = await GetAllProjectsAPI();
            if (response.success) {
                setProjects(response.data);
                const project = response.data.find((p: ProjectType) => p.id === projectId);
                if (project) {
                    setSelectedProject(project);
                    setIsLoading(false);
                    toast.success('Success', {
                        description: 'Project fetch success',
                        duration: 2000
                    });

                    return;
                } else {
                    toast.error('Error', {
                        description: 'This project was not found.',
                        duration: 2000
                    });
                }
            }
            toast.error('Error', {
                description: response.error?.message,
                duration: 2000
            });
            router.push('/dashboard');
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (project: ProjectType) => {
        if (project.id !== selectedProject?.id) {
            setSelectedProject(project);
            router.push(`/chat?projectId=${project.id}`);
        }
    };

    const handleCreateProject = async (data: { name: string; description: string }) => {
        setIsLoading(true);
        const response = await CreateProjectAPI({
            title: data.name,
            description: data.description
        });

        if (response.success) {
            setProjects([...projects, response.data]);
            setSelectedProject(response.data);
            setIsOpen(false);
            router.push(`/chat/?projectId=${response.data.id}`);
            toast.success('Success', {
                description: 'Project created successfully',
                duration: 2000
            });
        } else {
            toast.error('Error', {
                description: response.error?.message || 'Failed to create project',
                duration: 2000
            });
        }
        setIsLoading(false);
    };

    return (
        <SidebarMenu className='mt-2'>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-primary data-[state=open]:text-primary-foreground hover:bg-primary/90 transition-all duration-200'>
                            {isLoading ? (
                                <div className='flex w-full flex-row items-center gap-2'>
                                    <div className='bg-primary hover:bg-primary/90 text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                                        <Briefcase className='size-4' />
                                    </div>
                                    <div className='flex-1 space-y-2'>
                                        <Skeleton className='h-4 w-3/4' />
                                        <Skeleton className='h-3 w-1/2' />
                                    </div>
                                    <Skeleton className='h-4 w-4' />
                                </div>
                            ) : (
                                <>
                                    <div className='bg-primary hover:bg-primary/90 text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                                        <Briefcase className='size-4' />
                                    </div>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-medium'>{selectedProject?.title || ''}</span>
                                        <span className='truncate text-xs'>{selectedProject?.description || ''}</span>
                                    </div>
                                    <ChevronsUpDown className='ml-auto' />
                                </>
                            )}
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg border-none shadow-lg outline-hidden'
                        align='start'
                        // side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}>
                        <DropdownMenuLabel className='text-muted-foreground text-xs'>Dự án</DropdownMenuLabel>
                        {isLoading ? (
                            Array(3)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} className='p-2'>
                                        <Skeleton className='h-6 w-full' />
                                    </div>
                                ))
                        ) : (
                            <>
                                {projects.map((project, index) => (
                                    <DropdownMenuItem
                                        className={`hover:bg-primary/90 gap-2 p-2 ${project.id === selectedProject?.id ? 'bg-primary/10' : ''}`}
                                        key={project.id}
                                        onClick={() => handleProjectClick(project)}>
                                        {project.title}
                                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <div className='hover:bg-primary/50 flex cursor-pointer flex-row gap-2 rounded-sm p-2'>
                                            <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                                                <Plus className='size-4' />
                                            </div>
                                            <div className='font-medium'>Thêm dự án</div>
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
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
