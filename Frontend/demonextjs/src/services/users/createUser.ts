import { apiClient } from '../axios';
import { User, UserCreateRequest, ApiResponse } from '@/types';

// Tạo user mới
export const createUser = async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Failed to create user');
    }
    return response.data.result;
};
