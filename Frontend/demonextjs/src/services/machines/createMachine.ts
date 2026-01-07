import { apiClient } from '../axios';
import { Machine, MachineCreateRequest, ApiResponse } from '@/types';

// Tạo machine mới
export const createMachine = async (data: MachineCreateRequest): Promise<Machine> => {
    const response = await apiClient.post<ApiResponse<Machine>>('/machines', data);
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Failed to create machine');
    }
    return response.data.result;
};
