/**
 * Admin Service for LearnQuest
 * Handles all API calls to admin endpoints
 */

const API_BASE = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Generic fetch wrapper with error handling
async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
    }

    return data;
}

// ============================================================================
// Types
// ============================================================================

export interface AdminStats {
    total_users: number;
    user_growth_percent: number;
    total_learning_paths: number;
    active_learners_today: number;
    pending_approvals: number;
    pending_reports: number;
}

export interface PendingPath {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    creator: {
        id: number;
        username: string;
        email: string;
    };
    modules_count: number;
    created_at: string;
}

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    xp: number;
    created_at: string;
}

export interface Report {
    id: number;
    reporter_id: number;
    reporter: {
        id: number;
        username: string;
    };
    content_type: string;
    content_id: number;
    reason: string;
    details: string;
    status: string;
    action_taken: string | null;
    created_at: string;
    content_preview?: {
        content: string;
        author: string;
    };
}

export interface PaginationInfo {
    page: number;
    per_page: number;
    total: number;
    pages: number;
}

// ============================================================================
// API Functions
// ============================================================================

export const adminService = {
    // Dashboard Stats
    async getStats(): Promise<AdminStats> {
        const response = await fetchWithAuth<{ success: boolean; stats: AdminStats }>('/admin/stats');
        return response.stats;
    },

    // Pending Approvals
    async getPendingPaths(): Promise<PendingPath[]> {
        const response = await fetchWithAuth<{ success: boolean; pending_paths: PendingPath[] }>('/admin/pending');
        return response.pending_paths;
    },

    async approvePath(pathId: number): Promise<{ message: string; xp_awarded: number }> {
        return fetchWithAuth(`/admin/approve/${pathId}`, { method: 'POST' });
    },

    async rejectPath(pathId: number, reason: string): Promise<{ message: string }> {
        return fetchWithAuth(`/admin/reject/${pathId}`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },

    // User Management
    async getUsers(params?: {
        search?: string;
        role?: string;
        status?: string;
        page?: number;
        per_page?: number;
    }): Promise<{ users: AdminUser[]; pagination: PaginationInfo }> {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set('search', params.search);
        if (params?.role) queryParams.set('role', params.role);
        if (params?.status) queryParams.set('status', params.status);
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.per_page) queryParams.set('per_page', params.per_page.toString());

        const url = `/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`;
        return fetchWithAuth(url);
    },

    async changeUserRole(userId: number, role: string): Promise<{ message: string; user: AdminUser }> {
        return fetchWithAuth(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    },

    async suspendUser(userId: number, suspend: boolean = true): Promise<{ message: string }> {
        return fetchWithAuth(`/admin/users/${userId}/suspend`, {
            method: 'PUT',
            body: JSON.stringify({ suspend }),
        });
    },

    async deleteUser(userId: number): Promise<{ message: string }> {
        return fetchWithAuth(`/admin/users/${userId}`, {
            method: 'DELETE',
        });
    },

    // Content Moderation
    async getReports(params?: { status?: string; content_type?: string }): Promise<Report[]> {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.set('status', params.status);
        if (params?.content_type) queryParams.set('content_type', params.content_type);

        const url = `/admin/reports${queryParams.toString() ? `?${queryParams}` : ''}`;
        const response = await fetchWithAuth<{ success: boolean; reports: Report[] }>(url);
        return response.reports;
    },

    async dismissReport(reportId: number): Promise<{ message: string }> {
        return fetchWithAuth(`/admin/reports/${reportId}/dismiss`, { method: 'POST' });
    },

    async actionReport(reportId: number, action: string, notes?: string): Promise<{ message: string }> {
        return fetchWithAuth(`/admin/reports/${reportId}/action`, {
            method: 'POST',
            body: JSON.stringify({ action, notes }),
        });
    },
};
