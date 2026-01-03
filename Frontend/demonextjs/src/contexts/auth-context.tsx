'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest } from '@/services/api/auth.api';
import { usersApi } from '@/services/api/users.api';
import { User, UserCreateRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: UserCreateRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from backend on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('access_token');
        
        if (accessToken) {
          try {
            const userData = await usersApi.getMyInfo();
            setUser(userData);
          } catch (error) {
            console.error('Error loading user:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    
    // Save tokens to localStorage
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    
    // Wait a bit to ensure localStorage is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Fetch user info after successful login with the new token
    try {
      const userData = await usersApi.getMyInfo();
      setUser(userData);
      // Không tự động redirect ở đây, để component xử lý
    } catch (error) {
      console.error('Error fetching user info after login:', error);
      throw error;
    }
  };

  const register = async (data: UserCreateRequest) => {
    // Create user via POST /users
    await usersApi.createUser(data);
    
    // After successful registration, auto login
    await login({
      username: data.username,
      password: data.password,
    });
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const userData = await usersApi.getMyInfo();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
