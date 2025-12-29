import api from '../api';
import { ApiResponse, AuthResponse, LoginForm } from '@/types';

export const login = async (credentials: LoginForm): Promise<ApiResponse<AuthResponse>> => {
    try {
        const response = await api.post('/auth/login', credentials);
        return {
            success: true,
            data: response.data,
            message: 'Đăng nhập thành công',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || 'Đăng nhập thất bại',
        };
    }
};