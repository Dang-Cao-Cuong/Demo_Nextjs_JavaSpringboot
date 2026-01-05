import { apiClient } from '../axios';
import { ApiResponse } from '@/types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

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
    
    return data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });
    console.log('Refresh response:', response.data);
    
    if (response.data.code !== 1000 || !response.data.result) {
      throw new Error(response.data.message || 'Invalid refresh response');
    }
    
    const data = response.data.result;
    
    if (!data.accessToken) {
      console.error('Invalid refresh response:', response.data);
      throw new Error('Invalid refresh response: missing accessToken');
    }
    
    return data;
  },
};

export default authApi;
