import { apiClient } from '../axios';
import { Machine, ApiResponse } from '@/types';

// Lấy danh sách machines (không có pagination từ server)
export const getAllMachines = async (): Promise<Machine[]> => {
    try {
        console.log('Calling GET /machines...');
        console.log('Token:', typeof window !== 'undefined' ? localStorage.getItem('access_token')?.substring(0, 20) + '...' : 'N/A');

        const response = await apiClient.get<ApiResponse<Machine[]>>('/machines');
        console.log('getAllMachines response:', response.data);

        if (response.data.code !== 1000) {
            throw new Error(response.data.message || 'Failed to get machines');
        }

        // Server trả về toàn bộ mảng
        const result = response.data.result || [];
        console.log('Machines result:', result, 'Total:', result.length);
        return result;
    } catch (error: any) {
        console.error('getAllMachines error:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error headers:', error.response?.headers);
        console.error('Request config:', error.config);
        throw error;
    }
};
