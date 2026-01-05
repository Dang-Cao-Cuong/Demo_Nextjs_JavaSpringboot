import { apiClient } from '../axios';
import { ApiResponse } from '@/types';
import { tokenService } from './tokenService';
import { refreshTokenService } from './refreshTokenService';
import { LoginRequest,LoginResponse } from '@/types';




export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    console.log('Login response:', response.data);
    
    // Xử lý response: { code: 1000, result: { accessToken, refreshToken } }
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Invalid response: missing tokens');
    }
    
    const data = response.data.result;
    
    if (!data.accessToken || !data.refreshToken) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response: missing tokens');
    }

    // Lưu tokens sử dụng tokenService
    tokenService.setTokens(data.accessToken, data.refreshToken);
    
    return data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Luôn xóa tokens và reset state
      tokenService.clearTokens();
      refreshTokenService.reset();
    }
  },

  // Refresh token - Không nên gọi trực tiếp, dùng refreshTokenService
  // Giữ lại để backward compatibility
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });
    console.log('Refresh response:', response.data);
    
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Invalid refresh response');
    }
    
    const data = response.data.result;
    
    if (!data.accessToken || !data.refreshToken) {
      console.error('Invalid refresh response:', response.data);
      throw new Error('Invalid refresh response: missing tokens');
    }
    
    return data;
  },
};

export default authApi;
