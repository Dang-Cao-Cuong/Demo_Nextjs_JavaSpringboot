export type MachineStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RETIRED';

export const MACHINE_STATUS_CONFIG: Record<
  MachineStatus,
  { label: string; color: string; bgColor: string; chartColor: string }
> = {
  ACTIVE: {
    label: 'Hoạt động',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    chartColor: '#22c55e',
  },
  INACTIVE: {
    label: 'Không hoạt động',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    chartColor: '#6b7280',
  },
  MAINTENANCE: {
    label: 'Bảo trì',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    chartColor: '#3b82f6',
  },
  RETIRED: {
    label: 'Ngừng hoạt động',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    chartColor: '#ef4444',
  },
};
export interface MachineStatusBadgeProps{
    status:MachineStatus;
    className?:string;
}