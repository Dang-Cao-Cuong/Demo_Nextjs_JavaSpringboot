export interface CreateMachineDTO {
  name: string;
  model: string;
  manufactureYear: number;
  location: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
}