import { apiClient } from '../axios';
import { Machine, MachineUpdateRequest, ApiResponse } from '@/types';

// Cập nhật machine
export const updateMachine = async (id: string, data: MachineUpdateRequest): Promise<Machine> => {
    const response = await apiClient.put<ApiResponse<Machine>>(`/machines/${id}`, data);
    if (response.data.code !== 1000 || !response.data.result) {
        throw new Error(response.data.message || 'Failed to update machine');
    }
    return response.data.result;
};
