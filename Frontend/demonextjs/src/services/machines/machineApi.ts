import { fa } from 'zod/v4/locales';
import axiosInstance from '../axios';
import {
  Machine,
  MachineResponse,
  MachineFilter,
  CreateMachineDTO,
  UpdateMachineDTO,
  MachineStatus,
} from '@/types';

const MACHINES_ENDPOINT = '/machines';

// Bật mock mode khi chưa có backend
const USE_MOCK = true;

// Mock machines data
export const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Máy CNC Fanuc 01',
   
    model: 'Fanuc Robodrill α-D21MiB5',

    manufacture_year: 2020,
    location: 'Xưởng A - Khu 1',
    status: 'running',
   
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-12-20').toISOString(),
    is_deleted:false,
  },
  {
    id: '2',
    name: 'Máy CNC Haas 02',
    
    model: 'Haas VF-2SS',
  
    manufacture_year: 2019,
    location: 'Xưởng A - Khu 2',
    status: 'idle',
    
    created_at: new Date('2024-02-10').toISOString(),
    updated_at: new Date('2024-12-25').toISOString(),
    is_deleted:false,
  },
  {
    id: '3',
    name: 'Máy CNC Mazak 03',
  
    model: 'Mazak Integrex i-200',

    manufacture_year: 2021,
    location: 'Xưởng B - Khu 1',
    status: 'maintenance',
    
    created_at: new Date('2024-03-20').toISOString(),
    updated_at: new Date('2024-12-28').toISOString(),
    is_deleted:false
  },
  {
    id: '4',
    name: 'Máy CNC DMG Mori 04',
 
    model: 'DMG Mori NLX 2500',

    manufacture_year: 2018,
    location: 'Xưởng B - Khu 2',
    status: 'error',

    created_at: new Date('2024-04-05').toISOString(),
    updated_at: new Date('2024-12-29').toISOString(),
    is_deleted:false,
  },
  {
    id: '5',
    name: 'Máy CNC Okuma 05',

    model: 'Okuma MB-5000H',

    manufacture_year: 2022,
    location: 'Xưởng C - Khu 1',
    status: 'running',
  
    created_at: new Date('2024-05-12').toISOString(),
    updated_at: new Date('2024-12-30').toISOString(),
    is_deleted:false,
  },
  {
    id: '6',
    name: 'Máy CNC Brother 06',

    model: 'Brother Speedio S700X1',
    
    manufacture_year: 2023,
    location: 'Xưởng C - Khu 2',
    status: 'offline',
  
    created_at: new Date('2024-06-18').toISOString(),
    updated_at: new Date('2024-12-28').toISOString(),
    is_deleted:false,
  },
];

// Mock helper functions
const filterMachines = (machines: Machine[], filter?: MachineFilter): Machine[] => {
  let filtered = [...machines];

  if (filter?.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(searchLower) ||
        m.model.toLowerCase().includes(searchLower)
    );
  }

  if (filter?.status && filter.status !== 'all') {
    filtered = filtered.filter((m) => m.status === filter.status);
  }

  if (filter?.location) {
    filtered = filtered.filter((m) => m.location === filter.location);
  }

  // Sorting
  if (filter?.sortBy) {
    filtered.sort((a, b) => {
      const aValue = a[filter.sortBy as keyof Machine];
      const bValue = b[filter.sortBy as keyof Machine];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return filter.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return filter.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }

  return filtered;
};

const paginateMachines = (
  machines: Machine[],
  page: number = 1,
  limit: number = 10
): { data: Machine[]; meta: MachineResponse['meta'] } => {
  const total = machines.length;
  const totalPage = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = machines.slice(startIndex, endIndex);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPage,
    },
  };
};

export const machinesApi = {
  /**
   * Lấy danh sách máy với filter và pagination
   */
  getAll: async (filter?: MachineFilter): Promise<MachineResponse> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const filtered = filterMachines(mockMachines, filter);
      const result = paginateMachines(
        filtered,
        filter?.page || 1,
        filter?.limit || 10
      );
      
      return result;
    }
    
    const params = new URLSearchParams();
    
    if (filter?.search) params.append('search', filter.search);
    if (filter?.status && filter.status !== 'all') {
      params.append('status', filter.status);
    }
    if (filter?.location) params.append('location', filter.location);
    if (filter?.page) params.append('page', filter.page.toString());
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.sortBy) params.append('sortBy', filter.sortBy);
    if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

    const response = await axiosInstance.get<MachineResponse>(
      `${MACHINES_ENDPOINT}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Lấy chi tiết một máy theo ID
   */
  getById: async (id: string): Promise<Machine> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const machine = mockMachines.find((m) => m.id === id);
      if (!machine) {
        throw new Error('Không tìm thấy máy');
      }
      return machine;
    }
    
    const response = await axiosInstance.get<Machine>(
      `${MACHINES_ENDPOINT}/${id}`
    );
    return response.data;
  },

  /**
   * Tạo máy mới
   */
  create: async (data: CreateMachineDTO): Promise<Machine> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const newMachine: Machine = {
        id: String(mockMachines.length + 1),
        ...data,
        status: data.status || 'idle',
        manufacture_year:data.manufacturer_year,
        is_deleted:false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      mockMachines.push(newMachine);
      return newMachine;
    }
    
    const response = await axiosInstance.post<Machine>(
      MACHINES_ENDPOINT,
      data
    );
    return response.data;
  },

  /**
   * Cập nhật thông tin máy
   */
  update: async (id: string, data: UpdateMachineDTO): Promise<Machine> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const index = mockMachines.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error('Không tìm thấy máy');
      }
      
      mockMachines[index] = {
        ...mockMachines[index],
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      return mockMachines[index];
    }
    
    const response = await axiosInstance.patch<Machine>(
      `${MACHINES_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Xóa máy (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const index = mockMachines.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error('Không tìm thấy máy');
      }
      
      mockMachines.splice(index, 1);
      return;
    }
    
    await axiosInstance.delete(`${MACHINES_ENDPOINT}/${id}`);
  },

  /**
   * Cập nhật trạng thái máy
   */
  updateStatus: async (
    id: string,
    status: Machine['status']
  ): Promise<Machine> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockMachines.findIndex((m) => m.id === id);
      if (index === -1) {
        throw new Error('Không tìm thấy máy');
      }
      
      mockMachines[index].status = status;
      mockMachines[index].updated_at = new Date().toISOString();
      
      return mockMachines[index];
    }
    
    const response = await axiosInstance.patch<Machine>(
      `${MACHINES_ENDPOINT}/${id}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Lấy danh sách locations (để filter)
   */
  getLocations: async (): Promise<string[]> => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      const locations = Array.from(
        new Set(mockMachines.map((m) => m.location))
      );
      return locations;
    }
    
    const response = await axiosInstance.get<string[]>(
      `${MACHINES_ENDPOINT}/locations`
    );
    return response.data;
  },
};

export default machinesApi;
