import { apiClient } from '../axios';
import { User, UserUpdateRequest, ApiResponse } from '@/types';

// Cập nhật user
export const updateUser = async (id: string, data: UserUpdateRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Failed to update user');
    }
    return response.data.result;
};
