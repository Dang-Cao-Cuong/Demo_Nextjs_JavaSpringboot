import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, UserCreateRequest, AuthTokens } from '@/types';
import { authApi, userApi, tokenService } from '@/services';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            // Login API call (internal services handle token storage)
            const response = await authApi.login(credentials);

            // Fetch user info
            const user = await userApi.getMyInfo();
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data: UserCreateRequest, { dispatch, rejectWithValue }) => {
        try {
            await userApi.createUser(data);
            // Auto login after register
            await dispatch(login({ username: data.username, password: data.password }));
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
        } catch (error: any) {
            console.error('Logout error:', error);
            // Continue to logout logic even if API fails
        }
    }
);

export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { rejectWithValue }) => {
        if (typeof window === 'undefined') return null;

        const hasTokens = tokenService.hasTokens();
        if (!hasTokens) {
            return null;
        }

        try {
            const user = await userApi.getMyInfo();
            return user;
        } catch (error) {
            tokenService.clearTokens();
            return rejectWithValue('Session expired');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload as User;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            })
            // Initialize
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.user = action.payload as User;
                } else {
                    state.isAuthenticated = false;
                    state.user = null;
                }
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
