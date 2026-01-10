'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  restoreMachine,
  setFilters as setReduxFilters,
} from '@/redux/slices/machineSlice';
import {
  MachineCreateRequest,
  MachineUpdateRequest,
  MachineFilterParams,
} from "@/types";
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { getErrorMessageKey } from '@/utils/errorUtils';

export function useMachines(initialFilters?: MachineFilterParams) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { t } = useTranslation();

  const {
    filteredMachines, // Use filtered list for display
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isRestoring, // Add isRestoring status
    filters
  } = useAppSelector((state) => state.machines);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  // Set initial filters if provided and different from current
  useEffect(() => {
    if (initialFilters) {
      dispatch(setReduxFilters(initialFilters));
    }
  }, [dispatch, initialFilters]);

  const handleSetFilters = useCallback((newFilters: MachineFilterParams | ((prev: MachineFilterParams) => MachineFilterParams)) => {
    let resolvedFilters: MachineFilterParams;
    if (typeof newFilters === 'function') {
      // We can't access previous filters easily in this pattern without selecting it or pass it.
      // However, setReduxFilters merges, so we usually pass partial updates.
      // To support function update pattern properly we need to resolve it against current redux state.
      // But normally we just pass the object update.
      // For simplicity and to match previous interface, if function is passed we warn or try to support.
      // Simpler: Just resolve it against current filters from selector
      resolvedFilters = newFilters(filters);
    } else {
      resolvedFilters = newFilters;
    }
    dispatch(setReduxFilters(resolvedFilters));
  }, [dispatch, filters]);


  const handleCreateMachine = useCallback(async (data: MachineCreateRequest, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(createMachine(data)).unwrap();
      message.success(t('machine.form.button.create') + ' ' + t('common.success'));
      options?.onSuccess?.();
    } catch (err: any) {
      const errorKey = getErrorMessageKey(err);
      message.error(t(errorKey));
    }
  }, [dispatch, message, t]);

  const handleUpdateMachine = useCallback(async ({ id, data }: { id: string; data: MachineUpdateRequest }, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(updateMachine({ id, data })).unwrap();
      message.success(t('machine.form.button.update') + ' ' + t('common.success'));
      options?.onSuccess?.();
    } catch (err: any) {
      const errorKey = getErrorMessageKey(err);
      message.error(t(errorKey));
    }
  }, [dispatch, message, t]);

  const handleDeleteMachine = useCallback(async (id: string) => {
    try {
      await dispatch(deleteMachine(id)).unwrap();
      message.success(t('machine.delete_confirm.title') + ' ' + t('common.success'));
    } catch (err: any) {
      const errorKey = getErrorMessageKey(err);
      message.error(t(errorKey));
    }
  }, [dispatch, message, t]);

  const handleRestoreMachine = useCallback(async (id: string, options?: { onSuccess?: () => void }) => {
    try {
      await dispatch(restoreMachine(id)).unwrap();
      message.success(t('machine.label.restore_success', 'Khôi phục máy thành công')); // Add translation key later or use default
      options?.onSuccess?.();
    } catch (err: any) {
      const errorKey = getErrorMessageKey(err);
      message.error(t(errorKey));
    }
  }, [dispatch, message, t]);

  // For manual refetch if needed (though Redux keeps state)
  const refetch = useCallback(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  return {
    machines: filteredMachines,
    totalPages,
    totalElements,
    currentPage,
    isLoading,
    isError: !!error,
    error,
    filters,
    setFilters: handleSetFilters,
    refetch,
    createMachine: handleCreateMachine,
    updateMachine: handleUpdateMachine,
    deleteMachine: handleDeleteMachine,
    isCreating,
    isUpdating,
    isDeleting,
    restoreMachine: handleRestoreMachine,
    isRestoring,
  };
}

// Keep useMachine for single detail view if needed, or migrate it too. 
// For now, let's keep useMachine mostly as is but maybe using Redux cache if available?
// Actually the previous useMachine used useQuery with getMachineById. 
// We can keep it using React Query OR migrate to Redux. 
// Migration plan said "Refactor Hook". Let's migrate single machine fetch to Redux or just keep using API directly?
// Usually single fetch is fine with API if we don't store "currentSelectedMachine" in Redux.
// But to be consistent, let's leave useMachine (singular) as a simple API wrapper or keep usage of react-query only for details 
// IF we didn't add "selectedMachine" to slice.
// My machineSlice didn't have selectedMachine. So I will keep useMachine (singular) using useQuery or just direct API call for now, 
// OR simpler: just return the machine from the list if found?
// Best practice: Fetch fresh data for edit/detail. 
// For now I will NOT touch useMachine (singular) unless necessary, but the file replaces both.
// I should preserve useMachine code but maybe comment out or leave as legacy if not used, 
// OR just leave it using React Query from the original file? 
// The prompt implies moving "Machine data" generally.
// I will keep useMachine using React Query for now to reduce scope/risk, as the list breakdown is the main goal.
import { useQuery } from '@tanstack/react-query';
import { machineApi } from '@/services';

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
