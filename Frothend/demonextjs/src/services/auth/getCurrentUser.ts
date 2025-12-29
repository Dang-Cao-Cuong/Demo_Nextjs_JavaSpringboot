import api from '../api';
import { ApiResponse, User } from '@/types';

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
    try {
        const response = await api.get('/auth/me');
        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Không thể lấy thông tin người dùng',
        };
    }
};