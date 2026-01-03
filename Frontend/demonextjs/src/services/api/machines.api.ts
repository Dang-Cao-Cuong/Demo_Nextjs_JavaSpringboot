import { apiClient } from '../axios';
import {
  Machine,
  MachineCreateRequest,
  MachineUpdateRequest,
  MachinesResponse,
  MachineFilterParams,
} from '@/types';

export const machinesApi = {
  // Lấy danh sách machines với filter và pagination
  getAllMachines: async (params?: MachineFilterParams): Promise<MachinesResponse> => {
    const response = await apiClient.get<MachinesResponse>('/machines', { params });
    return response.data;
  },

  // Lấy chi tiết machine theo ID
  getMachineById: async (id: string): Promise<Machine> => {
    const response = await apiClient.get<Machine>(`/machines/${id}`);
    return response.data;
  },

  // Tạo machine mới
  createMachine: async (data: MachineCreateRequest): Promise<Machine> => {
    const response = await apiClient.post<Machine>('/machines', data);
    return response.data;
  },

  // Cập nhật machine
  updateMachine: async (id: string, data: MachineUpdateRequest): Promise<Machine> => {
    const response = await apiClient.put<Machine>(`/machines/${id}`, data);
    return response.data;
  },

  // Xóa machine
  deleteMachine: async (id: string): Promise<void> => {
    await apiClient.delete(`/machines/${id}`);
  },
};

export default machinesApi;
