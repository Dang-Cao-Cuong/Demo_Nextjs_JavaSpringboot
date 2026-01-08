import { apiClient } from './axios';
import { Machine, ApiResponse, MachineCreateRequest, MachineUpdateRequest } from '@/types';

export const machineApi = {
    // Lấy danh sách machines
    getAllMachines: async (): Promise<Machine[]> => {
        try {
            console.log('Calling GET /machines...');
            const response = await apiClient.get<ApiResponse<Machine[]>>('/machines');
            if (response.data.code !== 1000) {
                throw new Error(response.data.message || 'Failed to get machines');
            }
            return response.data.result || [];
        } catch (error: any) {
            console.error('getAllMachines error:', error);
            throw error;
        }
    },

    // Lấy chi tiết machine theo ID
    getMachineById: async (id: string): Promise<Machine | null> => {
        try {
            const response = await apiClient.get<ApiResponse<Machine>>(`/machines/${id}`);
            if (response.data.code !== 1000 || !response.data.result) {
                console.warn('Failed to get machine:', response.data.message);
                return null;
            }
            return response.data.result;
        } catch (error: any) {
            console.error('getMachineById error:', error.response?.data);
            return null;
        }
    },

    // Tạo machine mới
    createMachine: async (data: MachineCreateRequest): Promise<Machine> => {
        const response = await apiClient.post<ApiResponse<Machine>>('/machines', data);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error(response.data.message || 'Failed to create machine');
        }
        return response.data.result;
    },

    // Cập nhật machine
    updateMachine: async (id: string, data: MachineUpdateRequest): Promise<Machine> => {
        const response = await apiClient.put<ApiResponse<Machine>>(`/machines/${id}`, data);
        if (response.data.code !== 1000 || !response.data.result) {
            throw new Error(response.data.message || 'Failed to update machine');
        }
        return response.data.result;
    },

    // Xóa machine
    deleteMachine: async (id: string): Promise<void> => {
        const response = await apiClient.delete<ApiResponse<void>>(`/machines/${id}`);
        if (response.data.code !== 1000) {
            throw new Error(response.data.message || 'Failed to delete machine');
        }
    }
};

export default machineApi;
