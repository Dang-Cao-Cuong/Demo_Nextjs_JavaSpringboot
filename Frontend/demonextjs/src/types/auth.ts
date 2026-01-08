import { User } from './user';

// AuthToken.ts
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// TokenResponse.ts
export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

// BackendResponse.ts
export interface BackendResponse {
    code: number;
    message?: string;
    result?: TokenResponse;
}

// LoginFrom.ts
export interface LoginForm {
    email: string;
    password: string;
}

// LoginRequest.ts
export interface LoginRequest {
    username: string;
    password: string;
}

// LoginResponse.ts
export interface LoginResponse {
    token: string;
    authenticated: boolean;
}

// RegisterForm.ts
export interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

// AuthResponse.ts
export interface AuthResponse {
    user: User;
    token: string;
}

// AuthState.ts
export interface AuthState {
    user: User | null;
    token: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// AuthActions.ts
export interface AuthActions {
    setUser: (user: User) => void;
    setTokens: (tokens: AuthTokens) => void;
    login: (user: User, tokens: AuthTokens) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
}

// authStore.ts
export interface AuthStore extends AuthState {
    setUser: (user: User) => void;
    setTokens: (tokens: AuthTokens) => void;
    login: (user: User, tokens: AuthTokens) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
}
