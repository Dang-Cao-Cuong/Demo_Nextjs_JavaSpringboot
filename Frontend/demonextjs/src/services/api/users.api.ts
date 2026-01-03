import { apiClient } from '../axios';
import { User, UserCreateRequest, UserUpdateRequest } from '@/types/user/User';

export const usersApi = {
  // Lấy danh sách users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getMyInfo: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/myInfo');
    return response.data;
  },

  // Tạo user mới
  createUser: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },

  // Cập nhật user
  updateUser: async (id: string, data: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  // Xóa user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersApi;
