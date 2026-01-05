export interface Machine {
  id: string;
  name: string;
  model: string;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
  manufactureYear: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface MachineCreateRequest {
  name: string;
  model: string;
  location: string;
  status: string;
  manufactureYear: number;
}

export interface MachineUpdateRequest {
  name: string;
  model: string;
  location: string;
  status: string;
  manufactureYear: number;
}

export interface MachineFilterParams {
  name?: string;
  model?: string;
  location?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface MachinesResponse {
  content: Machine[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
