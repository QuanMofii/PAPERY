'use client';

import { useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { description } from '@/components/demo/chart-area-demo';
import useCreate from '@/hooks/use-create';
import useGet from '@/hooks/use-get';
import { parseData } from '@/hooks/use-gets';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/new-york-v4/ui/collapsible';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';
import { Textarea } from '@/registry/new-york-v4/ui/textarea';
import { ProjectType } from '@/schemas/project-list.schemas';
import { useListProjectStore } from '@/store/project-list.store';

import { ChevronsUpDown } from 'lucide-react';

export function ProjectSwitcher() {
    const router = useRouter();
    // const { isMobile } = useSidebar();
    const searchParams = useSearchParams();
    const { projects, selectedProject, setSelectedProject, setProjects } = useListProjectStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        router.push('/dashboard');
    }
    useGet('projects', projectId, setSelectedProject);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleCreateProject({
            name: formData.get('name') as string,
            description: formData.get('description') as string
        });
    };

    const handleCreateProject = async (data: { name: string; description: string }) => {
        setIsLoading(true);
        await useCreate('projects', data, projects, setProjects, 'project', null);
    };

    const handleProjectClick = (project: ProjectType) => {
        if (project.id !== selectedProject?.id) {
            setSelectedProject(project);
            router.push(`/chat?projectId=${project.id}`);
        }
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className='flex justify-between px-2 py-4'>
                <h3>Select Project</h3>
                <CollapsibleTrigger asChild>
                    <button>
                        <ChevronsUpDown />
                    </button>
                </CollapsibleTrigger>
            </div>
            <div className={`mb-4 cursor-pointer px-4 py-2 font-mono text-sm ${isOpen && 'hidden'}`}>
                {selectedProject?.name}
            </div>
            <CollapsibleContent className='mb-4'>
                {projects.map((item: ProjectType) => (
                    <div
                        key={item.id}
                        onClick={() => handleProjectClick(item)}
                        className='cursor-pointer px-4 py-2 font-mono text-sm'>
                        {item.name}
                    </div>
                ))}
            </CollapsibleContent>
            <div className='rounded-lg border border-dashed text-gray-500'>
                <div
                    onClick={() => setIsCreate(!isCreate)}
                    className={`w-full rounded-lg ${isCreate && 'border-b border-dashed'} cursor-pointer border-gray-500 p-2 text-center`}>
                    New Project
                </div>
                {isCreate && (
                    <form onSubmit={handleSubmit} className='flex flex-col gap-2 p-2'>
                        <div className=''>
                            <Label>Title</Label>
                            <Input id='name' name='name' placeholder='nhập tên dự án' />
                        </div>

                        <div className=''>
                            <Label>description</Label>
                            <Textarea id='description' name='description' placeholder='nhập mô tả dự án' />
                        </div>
                        <Button>Create</Button>
                    </form>
                )}
            </div>
        </Collapsible>
    );
}
