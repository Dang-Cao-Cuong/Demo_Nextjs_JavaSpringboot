import { apiClient } from '../axios';
import {
  Machine,
  MachineCreateRequest,
  MachineUpdateRequest,
  MachinesResponse,
  MachineFilterParams,
  ApiResponse,
} from '@/types';

export const machinesApi = {
  // Lấy danh sách machines (không có pagination từ server)
  getAllMachines: async (): Promise<Machine[]> => {
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
  },

  // Lấy chi tiết machine theo ID
  getMachineById: async (id: string): Promise<Machine | null> => {
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
  },
};
export default machinesApi;
