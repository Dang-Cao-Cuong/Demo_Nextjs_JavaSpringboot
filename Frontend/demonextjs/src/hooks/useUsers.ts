'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/users/usersApi';
import { UserCreateRequest, UserUpdateRequest } from '@/types';
import { message } from 'antd';

export function useUsers() {
  const queryClient = useQueryClient();

  // Fetch users
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({ 
    queryKey: ['users'],
    queryFn: usersApi.getAllUsers,
  });

  // Create user
  const createMutation = useMutation({
    mutationFn: (data: UserCreateRequest) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Tạo user thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Tạo user thất bại');
    },
  });

  // Update user
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Cập nhật user thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Cập nhật user thất bại');
    },
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('Xóa user thành công');
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || 'Xóa user thất bại');
    },
  });

  return {
    users,
    isLoading,
    isError,
    error,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useMyInfo() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['myInfo'],
    queryFn: usersApi.getMyInfo,
  });

  return {
    user,
    isLoading,
    isError,
    error,
  };
}
