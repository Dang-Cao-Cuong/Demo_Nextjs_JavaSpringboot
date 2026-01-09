import { apiClient } from './axios';
import { ApiResponse, LoginRequest, LoginResponse, AuthResponse, RegisterForm, User } from '@/types';
import { tokenService } from './index';
import { refreshTokenService } from './index';

export const authApi = {
    // Đăng nhập
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error(response.data.message || 'Invalid response: missing data');
        }

        const data = response.data.result;

        if (!data.token) {
            throw new Error('Invalid response: missing token');
        }

        // Lưu tokens sử dụng tokenService
        tokenService.setTokens(data.token);

        return data;
    },

    // Đăng xuất
    logout: async (token?: string): Promise<void> => {
        try {
            const accessToken = token || tokenService.getAccessToken();
            // Theo hình ảnh user gửi, body phải có dạng { "token": "string" }
            await apiClient.post('/auth/logout', { token: accessToken });
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            tokenService.clearTokens();
            refreshTokenService.reset();
        }
    },

    // Refresh token
    refresh: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });

        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error(response.data.message || 'Invalid refresh response');
        }

        const data = response.data.result;

        if (!data.token) {
            throw new Error('Invalid refresh response: missing token');
        }

        return data;
    },

    // Đăng ký
    register: async (data: RegisterForm): Promise<ApiResponse<AuthResponse>> => {
        try {
            const response = await apiClient.post('/auth/register', data);
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
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: async (): Promise<ApiResponse<User>> => {
        try {
            const response = await apiClient.get('/auth/me');
            return {
                success: true,
                result: response.data,
            } as any; // Adjust type if needed to match original return structure or fix ApiResponse generic usage
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Không thể lấy thông tin người dùng',
            } as any;
        }
    }
};

export default authApi;
