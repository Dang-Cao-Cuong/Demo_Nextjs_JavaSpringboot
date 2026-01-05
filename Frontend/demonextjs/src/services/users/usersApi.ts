import { apiClient } from '../axios';
import { User, UserCreateRequest, UserUpdateRequest } from '@/types';
import { ApiResponse } from '@/types';

export const usersApi = {
  // Lấy danh sách users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.result || [];
  },

  // Lấy thông tin user hiện tại
  getMyInfo: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/myInfo');
    console.log('MyInfo response:', response.data);
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Failed to get user info');
    }
    return response.data.result;
  },

  // Tạo user mới
  createUser: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Failed to create user');
    }
    return response.data.result;
  },

  // Cập nhật user
  updateUser: async (id: string, data: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Failed to update user');
    }
    return response.data.result;
  },

  // Xóa user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersApi;
