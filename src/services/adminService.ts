import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getPendingPaths: async () => {
    const response = await api.get('/admin/pending');
    return response.data.data.paths;
  },

  approvePath: async (pathId: number) => {
    const response = await api.post(`/admin/approve/${pathId}`);
    return response.data;
  },

  rejectPath: async (pathId: number, reason: string) => {
    const response = await api.post(`/admin/reject/${pathId}`, { reason });
    return response.data;
  },

  getUsers: async (params?: { role?: string; search?: string; page?: number }) => {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  },

  changeUserRole: async (userId: number, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  deleteUser: async (userId: number) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
};

export default adminService;
