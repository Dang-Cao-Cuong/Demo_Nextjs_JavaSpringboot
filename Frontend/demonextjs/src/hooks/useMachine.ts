'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machinesApi } from '@/services/machines/machineApi';
import {
  Machine,
  MachineCreateRequest,
  MachineUpdateRequest,
  MachineFilterParams,
} from "@/types";
import { message } from 'antd';

export function useMachines(initialFilters?: MachineFilterParams) {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MachineFilterParams>(initialFilters || {
    page: 0,
    size: 10,
  });

  // Fetch machines
  const {
    data: allMachines,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['machines'],
    queryFn: () => machinesApi.getAllMachines(),
  });

  // Apply filters
  const filteredMachines = allMachines ? allMachines.filter((machine) => {
    // Filter by name
    if (filters.name && !machine.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }
    
    // Filter by model
    if (filters.model && !machine.model.toLowerCase().includes(filters.model.toLowerCase())) {
      return false;
    }
    
    // Filter by location
    if (filters.location && !machine.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filters.status && machine.status !== filters.status) {
      return false;
    }
    
    return true;
  }) : [];

  // Client-side pagination
  const paginatedMachines = filteredMachines.slice(
    filters.page! * filters.size!,
    (filters.page! + 1) * filters.size!
  );

  // Create machine
  const createMutation = useMutation({
    mutationFn: (data: MachineCreateRequest) => machinesApi.createMachine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success('Tạo máy thành công');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Tạo máy thất bại');
    },
  });

  // Update machine
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MachineUpdateRequest }) =>
      machinesApi.updateMachine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success('Cập nhật máy thành công');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Cập nhật máy thất bại');
    },
  });

  // Delete machine
  const deleteMutation = useMutation({
    mutationFn: (id: string) => machinesApi.deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success('Xóa máy thành công');
    },
    onError: (error: any) => {
      message.error(error?.message || 'Xóa máy thất bại');
    },
  });

  return {
    machines: paginatedMachines,
    totalPages: filteredMachines ? Math.ceil(filteredMachines.length / (filters.size || 10)) : 0,
    totalElements: filteredMachines?.length || 0,
    currentPage: filters.page || 0,
    isLoading,
    isError,
    error,
    filters,
    setFilters,
    refetch,
    createMachine: createMutation.mutate,
    updateMachine: updateMutation.mutate,
    deleteMachine: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useMachine(id: string) {
  const {
    data: machine,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['machine', id],
    queryFn: () => machinesApi.getMachineById(id),
    enabled: !!id,
  });

  return {
    machine,
    isLoading,
    isError,
    error,
  };
}
