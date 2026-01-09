import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Machine, MachineFilterParams, MachineCreateRequest, MachineUpdateRequest } from '@/types';
import { machineApi } from '@/services';

interface MachineState {
    machines: Machine[];
    // Backend support pagination but currently frontend does client-side pagination mostly or mixed.
    // We will store all fetched machines for client-side filtering as per current implementation, 
    // or align with backend pagination if available. 
    // Looking at useMachine, it fetches getAllMachines() then filters client side.
    // We will replicate that behavior for now.
    filteredMachines: Machine[];
    totalElements: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    filters: MachineFilterParams;
    isLoading: boolean;
    error: string | null;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

const initialState: MachineState = {
    machines: [],
    filteredMachines: [],
    totalElements: 0,
    totalPages: 0,
    pageSize: 10,
    currentPage: 0,
    filters: {
        page: 0,
        size: 10,
    },
    isLoading: false,
    error: null,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
};

// Async Thunks
export const fetchMachines = createAsyncThunk(
    'machines/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const data = await machineApi.getAllMachines();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch machines');
        }
    }
);

export const createMachine = createAsyncThunk(
    'machines/create',
    async (data: MachineCreateRequest, { rejectWithValue }) => {
        try {
            const result = await machineApi.createMachine(data);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create machine');
        }
    }
);

export const updateMachine = createAsyncThunk(
    'machines/update',
    async ({ id, data }: { id: string; data: MachineUpdateRequest }, { rejectWithValue }) => {
        try {
            const result = await machineApi.updateMachine(id, data);
            return result;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update machine');
        }
    }
);

export const deleteMachine = createAsyncThunk(
    'machines/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await machineApi.deleteMachine(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete machine');
        }
    }
);

const machineSlice = createSlice({
    name: 'machines',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<MachineFilterParams>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.currentPage = action.payload.page !== undefined ? action.payload.page : state.currentPage;
            state.pageSize = action.payload.size !== undefined ? action.payload.size : state.pageSize;
            // Re-apply filters
            applyFilters(state);
        },
        updateMachineRealtime: (state, action: PayloadAction<Partial<Machine> & { id: string }>) => {
            const index = state.machines.findIndex(m => m.id === action.payload.id);
            if (index !== -1) {
                state.machines[index] = { ...state.machines[index], ...action.payload };
                applyFilters(state);
            }
        },
        clearErrors: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMachines.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.machines = action.payload;
                applyFilters(state);
            })
            .addCase(fetchMachines.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createMachine.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createMachine.fulfilled, (state, action) => {
                state.isCreating = false;
                state.machines.unshift(action.payload);
                applyFilters(state);
            })
            .addCase(createMachine.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload as string;
            })
            // Update
            .addCase(updateMachine.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updateMachine.fulfilled, (state, action) => {
                state.isUpdating = false;
                const index = state.machines.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.machines[index] = action.payload;
                    applyFilters(state);
                }
            })
            .addCase(updateMachine.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload as string;
            })
            // Delete
            .addCase(deleteMachine.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deleteMachine.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.machines = state.machines.filter(m => m.id !== action.payload);
                applyFilters(state);
            })
            .addCase(deleteMachine.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload as string;
            });
    },
});

// Helper function to apply filters (Client-side filtering logic from hook)
function applyFilters(state: MachineState) {
    const { machines, filters } = state;
    let result = [...machines];

    if (filters.name) {
        result = result.filter(m => m.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    if (filters.model) {
        result = result.filter(m => m.model.toLowerCase().includes(filters.model!.toLowerCase()));
    }
    if (filters.location) {
        result = result.filter(m => m.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters.status && filters.status !== 'all') { // Assuming 'all' might be passed or just string check
        result = result.filter(m => m.status === filters.status);
    }

    state.totalElements = result.length;
    state.totalPages = Math.ceil(result.length / state.pageSize);

    // Apply pagination
    const startIndex = (state.currentPage) * state.pageSize;
    state.filteredMachines = result.slice(startIndex, startIndex + state.pageSize);
}

export const { setFilters, updateMachineRealtime, clearErrors } = machineSlice.actions;
export default machineSlice.reducer;
