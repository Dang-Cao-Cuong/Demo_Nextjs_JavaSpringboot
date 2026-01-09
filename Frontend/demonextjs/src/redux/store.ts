import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import machineReducer from './slices/machineSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        machines: machineReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
