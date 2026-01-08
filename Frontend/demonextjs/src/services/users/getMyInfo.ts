import { apiClient } from '../axios';
import { User, ApiResponse } from '@/types';

// Lấy thông tin user hiện tại
export const getMyInfo = async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/myInfo');
    console.log('MyInfo response:', response.data);
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Failed to get user info');
    }
    return response.data.result;
};
