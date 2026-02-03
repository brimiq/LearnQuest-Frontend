import axios from 'axios';

const API_URL = '/api/comments';

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

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const commentService = {
    getComments: async (
        params: { learning_path_id?: number | string; resource_id?: number | string; page?: number }
    ) => {
        const response = await axios.get<CommentResponse>(API_URL, {
            params,
            headers: getAuthHeader()
        });
        return response.data;
    },

    createComment: async (data: {
        content: string;
        learning_path_id?: number | string;
        resource_id?: number | string;
        parent_id?: number;
    }) => {
        const response = await axios.post<Comment>(API_URL, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateComment: async (id: number, content: string) => {
        const response = await axios.put<Comment>(`${API_URL}/${id}`, { content }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteComment: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};
