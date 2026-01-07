import { apiClient } from '../axios';
import { ApiResponse } from '@/types';

// Xóa machine
export const deleteMachine = async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/machines/${id}`);
    if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Failed to delete machine');
    }
};
