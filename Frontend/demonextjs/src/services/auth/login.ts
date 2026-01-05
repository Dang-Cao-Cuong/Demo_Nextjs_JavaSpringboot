import api from '../api';
import { ApiResponse, AuthResponse, LoginForm } from '@/types';

export const login = async (credentials: LoginForm): Promise<ApiResponse<AuthResponse>> => {
    try {
        const response = await api.post('/auth/login', credentials);
        return {
            code: 1000,
            result: response.data,
            message: 'Đăng nhập thành công',
        };
    } catch (error: any) {
        return {
            code: error.response?.status || 500,
            message: error.response?.data?.message || 'Đăng nhập thất bại',
        };
    }
};