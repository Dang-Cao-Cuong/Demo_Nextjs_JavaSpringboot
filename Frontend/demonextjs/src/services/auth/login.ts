import { apiClient } from '../axios';
import { ApiResponse, LoginRequest, LoginResponse } from '@/types';
import { tokenService } from './tokenService';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    console.log('Login response:', response.data);

    // Xử lý response: { code: 1000, result: { token, authenticated } }
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Invalid response: missing data');
    }

    const data = response.data.result;

    if (!data.token) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response: missing token');
    }

    // Lưu tokens sử dụng tokenService (chỉ lưu access token)
    tokenService.setTokens(data.token);

    return data;
};