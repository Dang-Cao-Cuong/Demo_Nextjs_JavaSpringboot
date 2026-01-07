import { apiClient } from '../axios';
import { Machine, ApiResponse } from '@/types';

// Lấy chi tiết machine theo ID
export const getMachineById = async (id: string): Promise<Machine | null> => {
    try {
        console.log('Calling GET /machines/' + id);
        const response = await apiClient.get<ApiResponse<Machine>>(`/machines/${id}`);

        if (response.data.code !== 1000 || !response.data.result) {
            console.warn('Failed to get machine:', response.data.message);
            return null;
        }

        return response.data.result;
    } catch (error: any) {
        console.error('getMachineById error:', error.response?.data);
        // Lỗi enum từ backend - trả về null thay vì throw
        return null;
    }
};
