'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/services/api/roles.api';
import { RoleCreateRequest } from '@/types/role/Role';
import { message } from 'antd';

export function useRoles() {
  const queryClient = useQueryClient();

  // Fetch roles
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.getAllRoles,
  });

  // Create role
  const createMutation = useMutation({
    mutationFn: (data: RoleCreateRequest) => rolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Tạo role thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Tạo role thất bại');
    },
  });

  // Delete role
  const deleteMutation = useMutation({
    mutationFn: (name: string) => rolesApi.deleteRole(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Xóa role thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Xóa role thất bại');
    },
  });

  return {
    roles,
    isLoading,
    isError,
    error,
    createRole: createMutation.mutate,
    deleteRole: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
