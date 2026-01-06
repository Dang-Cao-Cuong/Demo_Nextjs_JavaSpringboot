/**
 * Refresh Token Service với Concurrency Control
 * Giải quyết vấn đề Race Condition khi nhiều request cùng refresh token
 * 
 * Cơ chế hoạt động:
 * 1. Request đầu tiên gọi API refresh và set flag isRefreshing = true
 * 2. Các request sau thấy isRefreshing = true → vào hàng đợi (queue)
 * 3. Khi refresh thành công → notify tất cả request trong queue với token mới
 * 4. Tất cả request retry với token mới
 */

import axios from 'axios';
import { tokenService } from './tokenService';
import { TokenResponse,BackendResponse } from '@/types';



class RefreshTokenService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  /**
   * Gọi API refresh token (chỉ 1 lần duy nhất)
   */
  private async callRefreshAPI(): Promise<TokenResponse> {
    const refreshToken = tokenService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // Tạo một axios instance riêng để TRÁNH LOOP với interceptor
      const refreshAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://10.60.243.54:8080/cnc/v1',
        timeout: 10000,
      });

      console.log('[RefreshToken]  Calling /auth/refresh...');

      const response = await refreshAxios.post<BackendResponse>('/auth/refresh', {
        refreshToken,
      });

      // Backend trả về: { code: 1000, result: { accessToken, refreshToken } }
      const { code, result, message } = response.data;

      if (code !== 1000 || !result || !result.accessToken || !result.refreshToken) {
        throw new Error(message || 'Invalid refresh response');
      }

      const { accessToken, refreshToken: newRefreshToken } = result;

      // Lưu cả 2 token mới (Token Rotation)
      tokenService.setTokens(accessToken, newRefreshToken);

      console.log('[RefreshToken]  Refresh thành công, token mới đã lưu');

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error('[RefreshToken]  Refresh thất bại:', error.response?.data || error.message);

      // Xóa token và logout
      tokenService.clearTokens();

      // Kiểm tra lỗi Security Breach
      const errorCode = error.response?.data?.code;
      if (errorCode === 'SECURITY_BREACH' || errorCode === 1014) {
        console.error('[RefreshToken]  SECURITY BREACH DETECTED!');
        if (typeof window !== 'undefined') {
          alert('Phát hiện hành vi đáng ngờ. Vui lòng đăng nhập lại.');
        }
      }

      throw error;
    }
  }

  /**
   * Thêm request vào hàng đợi và trả về Promise
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Sau khi refresh thành công, gọi lại tất cả request trong queue
   */
  private onRefreshSuccess(token: string): void {
    console.log(`[RefreshToken]  Thông báo token mới cho ${this.refreshSubscribers.length} request đang chờ`);
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Sau khi refresh thất bại, reject tất cả request trong queue
   */
  private onRefreshFailed(): void {
    console.log('[RefreshToken]  Hủy tất cả request đang chờ');
    this.refreshSubscribers = [];

    // Redirect về trang login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * PUBLIC METHOD: Refresh token với Concurrency Control
   * 
   * @returns Promise<string> - Access Token mới
   */
  public async refreshToken(): Promise<string> {
    // Nếu đang refresh, đưa request vào hàng đợi
    if (this.isRefreshing) {
      console.log('[RefreshToken]  Đang refresh, đưa request vào queue...');

      return new Promise((resolve) => {
        this.subscribeTokenRefresh((token: string) => {
          resolve(token);
        });
      });
    }

    // Đánh dấu đang refresh
    this.isRefreshing = true;

    try {
      const { accessToken } = await this.callRefreshAPI();

      // Thông báo token mới cho tất cả request đang chờ
      this.onRefreshSuccess(accessToken);

      return accessToken;
    } catch (error) {
      // Thông báo thất bại
      this.onRefreshFailed();
      throw error;
    } finally {
      // Reset flag
      this.isRefreshing = false;
    }
  }

  /**
   * Reset state (dùng khi logout manual)
   */
  public reset(): void {
    this.isRefreshing = false;
    this.refreshSubscribers = [];
    console.log('[RefreshToken] 🔄 Reset state');
  }
}

// Singleton instance
export const refreshTokenService = new RefreshTokenService();
