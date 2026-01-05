import { apiClient } from '../axios';
import { Role, RoleCreateRequest } from '@/types';

export const rolesApi = {
  // Lấy danh sách roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get<Role[]>('/roles');
    return response.data;
  },

  // Tạo role mới
  createRole: async (data: RoleCreateRequest): Promise<Role> => {
    const response = await apiClient.post<Role>('/roles', data);
    return response.data;
  },

  // Xóa role
  deleteRole: async (name: string): Promise<void> => {
    await apiClient.delete(`/roles/${name}`);
  },
};

export default rolesApi;
