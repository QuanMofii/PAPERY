import { http } from '@/lib/http';
import { CreateProjectRequestType , UpdateProjectRequestType } from '@/schemas/project-list.schemas';



export const GetAllProjectsAPI = async () => {
    return await http.get('/projects',{
        withCredentials: true
    });
};


export const CreateProjectAPI = async (data: CreateProjectRequestType ) => {
    return await http.post('/projects', data, {
        withCredentials: true
    });
};

export const UpdateProjectAPI = async (data: UpdateProjectRequestType) => {
    return await http.put(`/projects/${data.id}`, data, {
        withCredentials: true
    });
};

export const DeleteProjectAPI = async (id: string) => {
    return await http.delete(`/projects/${id}`,{
        withCredentials: true
    });
};
