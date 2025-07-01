import { z } from 'zod';

/* Schema chung có thể tái sử dụng */
const TitleSchema = z.object({
    name: z.string().min(1, 'Tên dự án không được để trống')
});

const DescriptionSchema = z.object({
    description: z.string().min(1, 'Mô tả không được để trống')
});

const TimestampSchema = z.object({
    updatedAt: z.string(),
    createdAt: z.string()
});

const CountSchema = z.object({
    fileCount: z.number(),
    conversationCount: z.number()
});

const IdSchema = z.object({
    id: z.string()
});

/* Schema response chung */
const SuccessResponseSchema = z.object({
    success: z.boolean(),
    error: z
        .object({
            message: z.string()
        })
        .optional()
});

/* Schema chính */
const Project = IdSchema.merge(TitleSchema).merge(DescriptionSchema).merge(TimestampSchema).merge(CountSchema);

const CreateProjectRequest = TitleSchema.merge(DescriptionSchema);

const UpdateProjectRequest = IdSchema.merge(CreateProjectRequest);

const ProjectResponse = SuccessResponseSchema.extend({
    data: z.array(Project)
});

const SingleProjectResponse = SuccessResponseSchema.extend({
    data: Project
});

/* 🎯 TypeScript Types */
export type ProjectType = z.infer<typeof Project>;
export type CreateProjectRequestType = z.infer<typeof CreateProjectRequest>;
export type UpdateProjectRequestType = z.infer<typeof UpdateProjectRequest>;
export type ProjectResponseType = z.infer<typeof ProjectResponse>;
export type SingleProjectResponseType = z.infer<typeof SingleProjectResponse>;

export { Project, CreateProjectRequest, UpdateProjectRequest, ProjectResponse, SingleProjectResponse };
