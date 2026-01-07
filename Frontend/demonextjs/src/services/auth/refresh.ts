import { apiClient } from '../axios';
import { ApiResponse, LoginResponse } from '@/types';

// Refresh token - Không nên gọi trực tiếp, dùng refreshTokenService
// Giữ lại để backward compatibility
export const refresh = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });
    console.log('Refresh response:', response.data);

    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Invalid refresh response');
    }

    const data = response.data.result;

    if (!data.token) {
        console.error('Invalid refresh response:', response.data);
        throw new Error('Invalid refresh response: missing token');
    }

    return data;
};
