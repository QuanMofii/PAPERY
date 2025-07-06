import { z } from 'zod';

/* Schema chung có thể tái sử dụng */
const TitleSchema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống')
});

const TimestampSchema = z.object({
    updatedAt: z.string(),
    createdAt: z.string()
});

const IdSchema = z.object({
    id: z.string()
});

const ProjectIdSchema = z.object({
    projectId: z.string()
});

const FavoriteSchema = z.object({
    favorite: z.boolean()
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
const ListChatSchema = IdSchema.merge(TitleSchema).merge(TimestampSchema).merge(ProjectIdSchema).merge(FavoriteSchema);

const CreateListChatRequest = TitleSchema.merge(ProjectIdSchema);

const UpdateListChatRequest = TitleSchema;

const ListChatResponse = SuccessResponseSchema.extend({
    data: z.array(ListChatSchema)
});

const SingleListChatResponse = SuccessResponseSchema.extend({
    data: ListChatSchema
});

/* 🎯 TypeScript Types */
export type ListChatType = z.infer<typeof ListChatSchema>;
export type CreateListChatRequestType = z.infer<typeof CreateListChatRequest>;
export type UpdateListChatRequestType = z.infer<typeof UpdateListChatRequest>;
export type ListChatResponseType = z.infer<typeof ListChatResponse>;
export type SingleListChatResponseType = z.infer<typeof SingleListChatResponse>;

export { ListChatSchema, CreateListChatRequest, UpdateListChatRequest, ListChatResponse, SingleListChatResponse };
