'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Dialog, } from '@/registry/new-york-v4/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/registry/new-york-v4/ui/dropdown-menu';

import { CalendarIcon, Edit, FileText, MessageSquare, MoreVertical, Trash2 } from 'lucide-react';
import { ProjectType } from '@/schemas/project-list.schemas';
import { useListProjectStore } from '@/store/project-list.store';
import { GetAllProjectsAPI, UpdateProjectAPI, DeleteProjectAPI } from '@/app/api/client/project-list.api';
import { ProjectSkeleton } from './project-list-skeleton';
import { ProjectDialogContent } from '@/components/project-dialog';

export function ProjectList() {
    const router = useRouter();
    const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { projects, setProjects, sortBy, updateProject, removeProject, setSelectedProject } = useListProjectStore();

    useEffect(() => {
        if (projects.length === 0) {
            fetchProjects();
        } else {
            setIsLoading(false);
        }
    }, []);

    const sortedProjects = [...projects].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'updated':
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            default:
                return 0;
        }
    });

    const fetchProjects = async () => {
        setIsLoading(true);
        const responses = await GetAllProjectsAPI();

        const response = {
            success: true,
            data: [
                {
                    id: '1',
                    title: 'Dự án AI Chatbot',
                    description: 'Xây dựng chatbot thông minh sử dụng AI',
                    fileCount: 5,
                    conversationCount: 10,
                    updatedAt: '2024-03-20',
                    createdAt: '2024-03-20'
                },
                {
                    id: '2',
                    title: 'Aệ thống quản lý',
                    description: 'Phần mềm quản lý dự án và tài liệu',
                    fileCount: 8,
                    conversationCount: 15,
                    updatedAt: '2024-03-19',
                    createdAt: '2024-03-19'
                },
                {
                    id: '3',
                    title: 'Website bán hàng',
                    description: 'Thiết kế và phát triển website thương mại điện tử',
                    fileCount: 12,
                    conversationCount: 20,
                    updatedAt: '2024-03-18',
                    createdAt: '2024-03-18'
                }
            ],
            error: { message: 'Error message' }
        };

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success
                ? 'Projects fetched successfully'
                : response.error?.message || 'Failed to fetch projects',
            duration: 2000
        });

        response.success && setProjects(response.data);
        setIsLoading(false);
    };

    const handleUpdateProject = async (data: { name: string; description: string }) => {
        if (!editingProject) return;
        const response = await UpdateProjectAPI({
            id: editingProject.id,
            title: data.name,
            description: data.description
        });

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success
                ? 'Project updated successfully'
                : response.error?.message || 'Failed to update project',
            duration: 2000
        });

        if (response.success) {
            updateProject({
                ...editingProject,
                title: data.name,
                description: data.description
            });
            setEditingProject(null);
        }
    };

    const handleDeleteProject = async (id: string) => {
        const response = await DeleteProjectAPI(id);

        toast[response.success ? 'success' : 'error'](response.success ? 'Success' : 'Error', {
            description: response.success
                ? 'Project deleted successfully'
                : response.error?.message || 'Failed to delete project',
            duration: 2000
        });

        if (response.success) {
            removeProject(id);
        }
    };

    const handleProjectClick = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
        }
        router.push(`/chat/?projectId=${projectId}`);
    };

    return (
        <>
            {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                    <ProjectSkeleton key={i} />
                ))
            ) : (
                sortedProjects.map((project) => (
                    <Card
                        key={project.id}
                        className="group relative overflow-hidden border-border/40 transition-all hover:shadow-md cursor-pointer gap-0 flex flex-col h-[200px] py-0"
                        onClick={() => handleProjectClick(project.id)}
                    >
                        <div className="absolute -right-10 top-0 h-20 w-20 rotate-12 bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                        <CardHeader className="relative z-10 bg-gradient-to-r from-primary/5 to-transparent px-3 py-2 bg-accent group-hover:bg-primary transition-all duration-500">
                            <div className="absolute -left-6 -top-6 h-12 w-12 rounded-full bg-primary/5 opacity-0 transition-all duration-300 group-hover:opacity-100"></div>
                            <div className="flex items-center justify-between">
                                <CardTitle className="relative z-10 line-clamp-1 text-lg">{project.title}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                            <span className="sr-only">More options</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProject(project);
                                        }}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Chỉnh sửa</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(project.id);
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Xóa</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 relative z-10 flex-1 flex flex-col pt-1 bg-accent/30">
                            <p className="line-clamp-3 text-sm text-muted-foreground flex-1">{project.description}</p>
                            <div className="flex items-center gap-4 my-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>{project.fileCount} tài liệu</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    <span>{project.conversationCount} cuộc trò chuyện</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="relative z-10 border-t border-border px-4 py-2 bg-accent/30">
                            <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CalendarIcon className="h-3.5 w-3.5" />
                                    <span>Cập nhật: {project.updatedAt}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                ))
            )}

            <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
                {editingProject && (
                    <ProjectDialogContent
                        title="Chỉnh sửa dự án"
                        description="Cập nhật thông tin dự án của bạn"
                        defaultValues={{
                            name: editingProject.title,
                            description: editingProject.description
                        }}
                        onSubmit={handleUpdateProject}
                    />
                )}
            </Dialog>
        </>
    );
}
