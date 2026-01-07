import { apiClient } from '../axios';
import { tokenService } from './tokenService';
import { refreshTokenService } from './refreshTokenService';

export const logout = async (): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        // Luôn xóa tokens và reset state
        tokenService.clearTokens();
        refreshTokenService.reset();
    }
};