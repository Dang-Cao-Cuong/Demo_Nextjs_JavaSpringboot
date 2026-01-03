import { apiClient } from '../axios';
import { User, UserCreateRequest, UserUpdateRequest } from '@/types/user/User';

// Backend ApiResponse wrapper
interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export const usersApi = {
  // Lấy danh sách users
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.result || response.data;
  },

  // Lấy thông tin user hiện tại
  getMyInfo: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/myInfo');
    console.log('MyInfo response:', response.data);
    return response.data.result || response.data;
  },

  // Tạo user mới
  createUser: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data.result || response.data;
  },

  // Cập nhật user
  updateUser: async (id: string, data: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.result || response.data;
  },

  // Xóa user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersApi;
