import { apiClient } from '../axios';
import { User, ApiResponse } from '@/types';

// Lấy danh sách users
export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data.result || [];
};
