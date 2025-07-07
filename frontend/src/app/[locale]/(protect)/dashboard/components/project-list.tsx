'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DeleteProjectAPI, UpdateProjectAPI } from '@/app/api/client/project-list.api';
import { ProjectDialogContent } from '@/components/project-dialog';
import useDelete from '@/hooks/use-delete';
import useGets from '@/hooks/use-gets';
import useQuery from '@/hooks/use-query';
import useUpdate from '@/hooks/use-update';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/registry/new-york-v4/ui/dropdown-menu';
import { ProjectType } from '@/schemas/project-list.schemas';
import { useListProjectStore } from '@/store/project-list.store';

import { ProjectSkeleton } from './project-list-skeleton';
import { CalendarIcon, Edit, FileText, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';

export function ProjectList() {
    const router = useRouter();
    const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const { projects, setProjects, sortBy, updateProject, removeProject, setSelectedProject } = useListProjectStore();

    // lay data projects tu api

    const [query] = useQuery({
        page: 1,
        items_per_page: 10
    });
    useGets('projects', query, 'project', setIsLoading);

    const handleUpdateProject = async (data: { name: string; description: string }) => {
        if (!editingProject) return;
        await useUpdate(
            'projects',
            {
                name: data.name,
                description: data.description
            },
            editingProject.id,
            editingProject,
            updateProject
        );
        setEditingProject(null);
    };

    const handleDeleteProject = async (id: string) => {
        await useDelete('projects', id, removeProject);
    };

    const handleProjectClick = (projectId: string) => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
            setSelectedProject(project);
        }
        router.push(`/chat/?projectId=${projectId}`);
    };

    return (
        <>
            {isLoading
                ? Array(3)
                      .fill(0)
                      .map((_, i) => <ProjectSkeleton key={i} />)
                : projects.map((project, i) => (
                      <Card
                          key={project.id}
                          className='group border-border/40 relative flex h-[200px] cursor-pointer flex-col gap-0 overflow-hidden py-0 transition-all hover:shadow-md'
                          onClick={() => handleProjectClick(project.id)}>
                          <div className='bg-primary/5 absolute top-0 -right-10 h-20 w-20 rotate-12 opacity-0 transition-all duration-300 group-hover:opacity-100'></div>
                          <CardHeader className='from-primary/5 bg-accent group-hover:bg-primary relative z-10 bg-gradient-to-r to-transparent px-3 py-2 transition-all duration-500'>
                              <div className='bg-primary/5 absolute -top-6 -left-6 h-12 w-12 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100'></div>
                              <div className='flex items-center justify-between'>
                                  <CardTitle className='relative z-10 line-clamp-1 text-lg'>{project.name}</CardTitle>
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                          <Button variant='ghost' size='icon' className='h-8 w-8'>
                                              <MoreVertical className='h-4 w-4' />
                                              <span className='sr-only'>More options</span>
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align='end'>
                                          <DropdownMenuItem
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setOpen(!open);
                                                  setEditingProject(project);
                                              }}>
                                              <Edit className='mr-2 h-4 w-4' />
                                              <span>Chỉnh sửa</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                              className='text-destructive focus:text-destructive'
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleDeleteProject(project.id);
                                              }}>
                                              <Trash2 className='mr-2 h-4 w-4' />
                                              <span>Xóa</span>
                                          </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </div>
                          </CardHeader>
                          <CardContent className='bg-accent/30 relative z-10 flex flex-1 flex-col px-4 pt-1'>
                              <p className='text-muted-foreground line-clamp-3 flex-1 text-sm'>{project.description}</p>
                              <div className='my-2 flex items-center gap-4'>
                                  <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                                      <FileText className='h-3.5 w-3.5' />
                                      <span>{project.fileCount} tài liệu</span>
                                  </div>
                                  <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                                      <MessageSquare className='h-3.5 w-3.5' />
                                      <span>{project.conversationCount} cuộc trò chuyện</span>
                                  </div>
                              </div>
                          </CardContent>
                          <CardFooter className='border-border bg-accent/30 relative z-10 border-t px-4 py-2'>
                              <div className='flex w-full items-center justify-between'>
                                  <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                                      <CalendarIcon className='h-3.5 w-3.5' />
                                      <span>Cập nhật: {project.updatedAt}</span>
                                  </div>
                              </div>
                          </CardFooter>
                      </Card>
                  ))}

            {editingProject && (
                <ProjectDialogContent
                    title='Chỉnh sửa dự án'
                    description='Cập nhật thông tin dự án của bạn'
                    isOpen={open}
                    onOpenChange={setOpen}
                    defaultValues={{
                        name: editingProject.name,
                        description: editingProject.description
                    }}
                    onSubmit={handleUpdateProject}
                />
            )}
        </>
    );
}
