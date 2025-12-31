export type MachineStatus="running"|"idle"|"maintenance"|"error"|"offline";

export const MACHINE_STATUS_CONFIG: Record<
  MachineStatus,
  { label: string; color: string; bgColor: string; chartColor: string }
> = {
  running: {
    label: 'Đang chạy',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    chartColor: '#22c55e',
  },
  idle: {
    label: 'Chờ',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    chartColor: '#eab308',
  },
  maintenance: {
    label: 'Bảo trì',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    chartColor: '#3b82f6',
  },
  error: {
    label: 'Lỗi',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    chartColor: '#ef4444',
  },
  offline: {
    label: 'Offline',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    chartColor: '#6b7280',
  },
};
export interface MachineStatusBadgeProps{
    status:MachineStatus;
    className?:string;
}