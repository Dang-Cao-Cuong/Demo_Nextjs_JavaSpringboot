import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { machinesApi } from '@/services/machines/machineApi';
import {
  Machine,
  MachineFilter,
  CreateMachineDTO,
  UpdateMachineDTO,
} from '@/types';

// Query keys
export const machineKeys = {
  all: ['machines'] as const,
  lists: () => [...machineKeys.all, 'list'] as const,
  list: (filter: MachineFilter) => [...machineKeys.lists(), filter] as const,
  details: () => [...machineKeys.all, 'detail'] as const,
  detail: (id: string) => [...machineKeys.details(), id] as const,
  locations: () => [...machineKeys.all, 'locations'] as const,
};

/**
 * Hook lấy danh sách máy với filter và pagination
 */
export function useMachines(filter: MachineFilter = {}) {
  return useQuery({
    queryKey: machineKeys.list(filter),
    queryFn: () => machinesApi.getAll(filter),
  });
}

/**
 * Hook lấy chi tiết một máy
 */
export function useMachine(id: string) {
  return useQuery({
    queryKey: machineKeys.detail(id),
    queryFn: () => machinesApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook lấy danh sách locations
 */
export function useLocations() {
  return useQuery({
    queryKey: machineKeys.locations(),
    queryFn: () => machinesApi.getLocations(),
  });
}

/**
 * Hook tạo máy mới
 */
export function useCreateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMachineDTO) => machinesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machineKeys.lists() });
      message.success('Tạo máy mới thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi tạo máy');
    },
  });
}

/**
 * Hook cập nhật máy
 */
export function useUpdateMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMachineDTO }) =>
      machinesApi.update(id, data),
    onSuccess: (machine: Machine) => {
      queryClient.invalidateQueries({ queryKey: machineKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: machineKeys.detail(machine.id),
      });
      message.success('Cập nhật máy thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật máy');
    },
  });
}

/**
 * Hook xóa máy
 */
export function useDeleteMachine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => machinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: machineKeys.lists() });
      message.success('Xóa máy thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi xóa máy');
    },
  });
}

/**
 * Hook cập nhật trạng thái máy
 */
export function useUpdateMachineStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Machine['status'] }) =>
      machinesApi.updateStatus(id, status),
    onSuccess: (machine: Machine) => {
      queryClient.invalidateQueries({ queryKey: machineKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: machineKeys.detail(machine.id),
      });
      message.success('Cập nhật trạng thái thành công!');
    },
    onError: (error: Error) => {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });
}
