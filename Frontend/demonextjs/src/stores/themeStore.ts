import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    colorPrimary: string;
    borderRadius: number;
    compactMode: boolean;
    setColorPrimary: (color: string) => void;
    setBorderRadius: (radius: number) => void;
    setCompactMode: (isCompact: boolean) => void;
    resetTheme: () => void;
}

const DEFAULT_THEME_STATE = {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    compactMode: false,
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            ...DEFAULT_THEME_STATE,
            setColorPrimary: (colorPrimary) => set({ colorPrimary }),
            setBorderRadius: (borderRadius) => set({ borderRadius }),
            setCompactMode: (compactMode) => set({ compactMode }),
            resetTheme: () => set(DEFAULT_THEME_STATE),
        }),
        {
            name: 'theme-storage', // name of the item in the storage (must be unique)
        }
    )
);
