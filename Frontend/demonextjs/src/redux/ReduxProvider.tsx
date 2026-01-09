'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { initializeAuth } from './slices/authSlice';
import { useEffect, useRef } from 'react';

function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const initialized = useRef(false);

    useEffect(() => {
        if (!initialized.current) {
            dispatch(initializeAuth());
            initialized.current = true;
        }
    }, [dispatch]);

    return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
}
