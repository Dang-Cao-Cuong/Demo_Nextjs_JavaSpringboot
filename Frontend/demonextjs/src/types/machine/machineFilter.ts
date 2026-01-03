import { MachineStatus } from "./machineStatus";

export interface MachineFilter {
  name?: string;
  model?: string;
  location?: string;
  status?: MachineStatus | 'all';
  page?: number;
  size?: number;
  sort?: string;
}

export interface MachineFilterProps {
  search: string;
  status?: MachineStatus | 'all';
  onSearchChange: (value: string) => void;
  onStatusChange: (value: MachineStatus | 'all') => void;
  onClear: () => void;
}