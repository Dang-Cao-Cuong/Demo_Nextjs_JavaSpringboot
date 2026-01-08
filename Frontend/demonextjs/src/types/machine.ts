// MachineStatus.ts
export type MachineStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';

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
    ERROR: {
        label: 'Ngừng hoạt động',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        chartColor: '#ef4444',
    },
};

export interface MachineStatusBadgeProps {
    status: MachineStatus;
    className?: string;
}

// Machine.ts
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

// createMachineDTO.ts
export interface CreateMachineDTO {
    name: string;
    model: string;
    manufactureYear: number;
    location: string;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'ERROR';
}

// updateMachineDTO.ts
export interface UpdateMachineDTO extends Partial<CreateMachineDTO> { }

// MachineErrorNotification.ts
export interface MachineErrorNotification {
    machineId: string;
    machineName: string;
    message: string; // Backend gửi 'message' không phải 'errorMessage'
    timestamp: string; // ISO 8601 format

    // Optional fields (backend có thể không gửi)
    errorCode?: string;
    errorMessage?: string;
    status?: 'ERROR';
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// machineFilter.ts
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

// machineFormData.ts
export interface MachineFormData {
    name: string;
    model: string;
    manufactureYear: number;
    location: string;
    status: MachineStatus;
}

export interface MachineFormProps {
    machine?: Machine;
    onSubmit: (data: MachineFormData) => void;
    isLoading?: boolean;
}

// machineResponse.ts
export interface MachineResponse {
    content: Machine[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

// machineTable.ts
export interface MachineTableProps {
    machines: Machine[];
    isLoading?: boolean;
    onEdit?: (machine: Machine) => void;
    onDelete?: (machine: Machine) => void;
    onSort?: (field: string) => void;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
