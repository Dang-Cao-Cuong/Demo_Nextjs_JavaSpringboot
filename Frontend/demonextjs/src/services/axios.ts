import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.60.243.54:8080/cnc/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    // Chỉ truy cập localStorage trên client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Chỉ xử lý trên client
    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        console.log('Refresh token response:', response.data);
        
        // Backend trả về: { code: 1000, result: { accessToken, refreshToken } }
        const responseData = response.data;
        
        let accessToken: string;
        if (responseData.code === 1000 && responseData.result) {
          accessToken = responseData.result.accessToken;
        } else if (responseData.accessToken) {
          // Fallback: direct response
          accessToken = responseData.accessToken;
        } else {
          console.error('No accessToken in refresh response:', response.data);
          throw new Error(responseData.message || 'Invalid refresh token response');
        }
        
        if (!accessToken) {
          throw new Error('Invalid refresh token response: missing accessToken');
        }
        
        localStorage.setItem('access_token', accessToken);

        // Retry request với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token thất bại -> logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
