import api from '../api';
import { ApiResponse, AuthResponse, RegisterForm } from '@/types';

export const register = async (data: RegisterForm): Promise<ApiResponse<AuthResponse>> => {
    try {
        const response = await api.post('/auth/register', data);
        return {
            code: 1000,
            result: response.data,
            message: 'Đăng ký thành công',
        };
    } catch (error: any) {
        return {
            code: error.response?.status || 500,
            message: error.response?.data?.message || 'Đăng ký thất bại',
        };
    }
};