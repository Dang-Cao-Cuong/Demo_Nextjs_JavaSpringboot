/**
 * Token Service - Quản lý Access Token và Refresh Token
 * Centralized token management để đảm bảo consistency
 */

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenService = {
    /**
     * Lấy Access Token từ localStorage
     */
    getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Lấy Refresh Token từ localStorage
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Lưu cả 2 token (Token Rotation - Backend trả về cả 2)
     */
    setTokens(accessToken: string, refreshToken?: string | null): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(TOKEN_KEY, accessToken);
        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }


        console.log(' [TokenService] Đã lưu tokens mới');
    },

    /**
     * Xóa tất cả token (Logout)
     */
    clearTokens(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        console.log(' [TokenService] Đã xóa tất cả tokens');
    },

    /**
     * Kiểm tra xem có token hay không
     */
    hasTokens(): boolean {
        return !!this.getAccessToken();
    }
};
