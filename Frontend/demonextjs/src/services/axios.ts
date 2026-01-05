/**
 * Axios Instance với Interceptor xử lý Silent Refresh Token
 * 
 * Features:
 * - Tự động đính kèm Authorization header
 * - Silent Refresh Token khi 401
 * - Race Condition handling (chỉ 1 request refresh duy nhất)
 * - Token Rotation support (Backend trả về cả accessToken và refreshToken mới)
 * - Security Breach Detection
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenService } from './auth/tokenService';
import { refreshTokenService } from './auth/refreshTokenService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://10.60.243.54:8080/cnc/v1';

// Tạo axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 * Tự động đính kèm Authorization header
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.getAccessToken();

    // Đính kèm token nếu có (trừ request refresh để tránh loop)
    if (token && !config.url?.includes('/auth/refresh')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Xử lý lỗi 401 và Silent Refresh Token với Race Condition handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Response thành công
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Kiểm tra lỗi 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      console.log('[Axios] 🔒 401 Unauthorized - Cần refresh token');

      // Đánh dấu request này đã retry (tránh loop vô tận)
      originalRequest._retry = true;

      // TRÁNH REFRESH CHO CHÍNH API REFRESH (để tránh loop)
      if (originalRequest.url?.includes('/auth/refresh')) {
        console.log('[Axios] ⚠️ Refresh API bị lỗi, logout...');
        tokenService.clearTokens();
        refreshTokenService.reset();
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        // Gọi refresh token với Concurrency Control
        // Nếu có nhiều request 401 cùng lúc, chỉ 1 request gọi API refresh
        // Các request khác sẽ đợi trong queue
        const newAccessToken = await refreshTokenService.refreshToken();

        console.log('[Axios] ✅ Đã có token mới, retry request...');

        // Cập nhật token mới vào header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry request gốc với token mới
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[Axios] ❌ Refresh token thất bại, logout...');

        // Logout và chuyển về login
        tokenService.clearTokens();
        refreshTokenService.reset();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Các lỗi khác (không phải 401)
    return Promise.reject(error);
  }
);

export default apiClient;
