import api from './api';

export interface CommentUser {
    id: number;
    username: string;
    avatar_url: string;
}

export interface Comment {
    id: number;
    content: string;
    user_id: number;
    learning_path_id?: number;
    resource_id?: number;
    parent_id?: number;
    created_at: string;
    updated_at?: string;
    is_deleted: boolean;
    user: CommentUser;
    replies?: Comment[];
}

export interface CommentResponse {
    comments: Comment[];
    total: number;
    pages: number;
    current_page: number;
}

export const commentService = {
    getComments: async (
        params: { learning_path_id?: number | string; resource_id?: number | string; page?: number }
    ) => {
        const response = await api.get<CommentResponse>('/comments', { params });
        return response.data;
    },

    createComment: async (data: {
        content: string;
        learning_path_id?: number | string;
        resource_id?: number | string;
        parent_id?: number;
    }) => {
        const response = await api.post<Comment>('/comments', data);
        return response.data;
    },

    updateComment: async (id: number, content: string) => {
        const response = await api.put<Comment>(`/comments/${id}`, { content });
        return response.data;
    },

    deleteComment: async (id: number) => {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    }
};
