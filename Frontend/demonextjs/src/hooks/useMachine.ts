'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machinesApi } from '@/services/api/machines.api';
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
    data: machinesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['machines', filters],
    queryFn: () => machinesApi.getAllMachines(filters),
  });

  // Create machine
  const createMutation = useMutation({
    mutationFn: (data: MachineCreateRequest) => machinesApi.createMachine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success('Tạo máy thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Tạo máy thất bại');
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
      message.error(error?.response?.data?.message || 'Cập nhật máy thất bại');
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
      message.error(error?.response?.data?.message || 'Xóa máy thất bại');
    },
  });

  return {
    machines: machinesResponse?.content || [],
    totalPages: machinesResponse?.totalPages || 0,
    totalElements: machinesResponse?.totalElements || 0,
    currentPage: machinesResponse?.number || 0,
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
