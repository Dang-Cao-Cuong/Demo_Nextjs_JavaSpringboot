'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { machineApi } from '@/services';
import {
  Machine,
  MachineCreateRequest,
  MachineUpdateRequest,
  MachineFilterParams,
} from "@/types";
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { getErrorMessageKey } from '@/utils/errorUtils';

export function useMachines(initialFilters?: MachineFilterParams) {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();
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
    queryFn: () => machineApi.getAllMachines(),
  });

  // Apply filters
  const filteredMachines = useMemo(() => {
    return allMachines ? allMachines.filter((machine) => {
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
  }, [allMachines, filters]);

  // Client-side pagination
  const paginatedMachines = useMemo(() => {
    return filteredMachines.slice(
      filters.page! * filters.size!,
      (filters.page! + 1) * filters.size!
    );
  }, [filteredMachines, filters.page, filters.size]);

  // Create machine
  const createMutation = useMutation({
    mutationFn: (data: MachineCreateRequest) => machineApi.createMachine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success(t('machine.form.button.create') + ' ' + t('common.success'));
    },
    onError: (error: any) => {
      const errorKey = getErrorMessageKey(error);
      message.error(t(errorKey));
    },
  });

  // Update machine
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MachineUpdateRequest }) =>
      machineApi.updateMachine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success(t('machine.form.button.update') + ' ' + t('common.success'));
    },
    onError: (error: any) => {
      const errorKey = getErrorMessageKey(error);
      message.error(t(errorKey));
    },
  });

  // Delete machine
  const deleteMutation = useMutation({
    mutationFn: (id: string) => machineApi.deleteMachine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      message.success(t('machine.delete_confirm.title') + ' ' + t('common.success'));
    },
    onError: (error: any) => {
      const errorKey = getErrorMessageKey(error);
      message.error(t(errorKey));
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
    queryFn: () => machineApi.getMachineById(id),
    enabled: !!id,
  });

  return {
    machine,
    isLoading,
    isError,
    error,
  };
}
