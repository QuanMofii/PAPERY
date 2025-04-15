import { create } from 'zustand';
import { ProjectType } from '@/schemas/project-list.schemas';

interface ListProjectState {
    projects: ProjectType[];
    selectedProject: ProjectType | null;
    sortBy: 'name' | 'created' | 'updated';

    setProjects: (projects: ProjectType[]) => void;
    setSelectedProject: (project: ProjectType | null) => void;
    addProject: (project: ProjectType) => void;
    updateProject: (project: ProjectType) => void;
    removeProject: (projectId: string) => void;
    setSortBy: (sortBy: 'name' | 'created' | 'updated') => void;
}

export const useListProjectStore = create<ListProjectState>((set) => ({
    projects: [],
    selectedProject: null,
    sortBy: 'name',

    setProjects: (projects) => {
        console.log('Setting projects:', projects);
        set({ projects });
    },
    setSelectedProject: (project) => {
        console.log('Setting selected project:', project);
        set({ selectedProject: project });
    },
    addProject: (project) => {
        console.log('Adding project:', project);
        set((state) => ({ projects: [...state.projects, project] }));
    },
    updateProject: (project) => {
        console.log('Updating project:', project);
        set((state) => ({
            projects: state.projects.map((p) => (p.id === project.id ? project : p))
        }));
    },
    removeProject: (projectId) => {
        console.log('Removing project:', projectId);
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== projectId)
        }));
    },
    setSortBy: (sortBy) => {
        console.log('Setting sort by:', sortBy);
        set({ sortBy });
    }
}));
