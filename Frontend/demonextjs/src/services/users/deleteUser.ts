import { apiClient } from '../axios';

// Xóa user
export const deleteUser = async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
};
