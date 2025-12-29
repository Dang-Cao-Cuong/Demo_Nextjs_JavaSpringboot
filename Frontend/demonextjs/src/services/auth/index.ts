// src/services/auth/index.ts
import { login } from './login';
import { register } from './register';
import { logout } from './logout';
import { getCurrentUser } from './getCurrentUser';

export const authService = {
    login,
    register,
    logout,
    getCurrentUser,
};