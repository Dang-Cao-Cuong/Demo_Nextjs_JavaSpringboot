import api from '../api';
import { ApiResponse, AuthResponse, RegisterForm } from '@/types';

export const register = async (data: RegisterForm): Promise<ApiResponse<AuthResponse>> => {
    try {
        const response = await api.post('/auth/register', data);
        return {
            success: true,
            data: response.data,
            message: 'Đăng ký thành công',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Đăng ký thất bại',
        };
    }
};