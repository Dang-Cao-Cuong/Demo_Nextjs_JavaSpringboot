import { Machine } from "./machine";

export interface MachineTableProps {
  machines: Machine[];
  isLoading?: boolean;
  onEdit?: (machine: Machine) => void;
  onDelete?: (machine: Machine) => void;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
