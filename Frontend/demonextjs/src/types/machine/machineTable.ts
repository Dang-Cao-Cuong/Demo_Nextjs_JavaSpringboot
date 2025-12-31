import { Machine } from "./machine";
export interface MachineTableProps {
  machines: Machine[];
  isLoading?: boolean;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'dec';
}
