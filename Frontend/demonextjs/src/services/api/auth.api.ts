import { apiClient } from '../axios';

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

// Backend ApiResponse wrapper
interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

export const authApi = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    console.log('Login response:', response.data);
    
    // Xử lý cả 2 trường hợp: response có wrapper ApiResponse hoặc không
    const data = response.data.result || response.data;
    console.log('Extracted data:', data);
    
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
    
    const data = response.data.result || response.data;
    
    if (!data.accessToken) {
      console.error('Invalid refresh response:', response.data);
      throw new Error('Invalid refresh response: missing accessToken');
    }
    
    return data;
  },
};

export default authApi;

