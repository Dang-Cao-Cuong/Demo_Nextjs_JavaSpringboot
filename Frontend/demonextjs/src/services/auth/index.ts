// src/services/auth/index.ts
export * from './login';
export * from './register';
export * from './logout';
export * from './refresh';
export * from './getCurrentUser';

import { login } from './login';
import { register } from './register';
import { logout } from './logout';
import { refresh } from './refresh';
import { getCurrentUser } from './getCurrentUser';

export const authService = {
    login,
    register,
    logout,
    refresh,
    getCurrentUser,
};
