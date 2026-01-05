'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/auth/authApi';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, logout, accessToken } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Kiểm tra xem có token trong storage không
      const storedToken = localStorage.getItem('accessToken');
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Verify token bằng cách gọi API lấy thông tin user
        const user = await authApi.getCurrentUser();
        setUser(user);
      } catch (error) {
        // Token không hợp lệ, logout
        console.error('Failed to verify token:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [accessToken, setUser, setLoading, logout]);

  return <>{children}</>;
}

export default AuthProvider;
