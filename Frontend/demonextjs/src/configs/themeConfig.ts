import { ThemeConfig } from 'antd';

export const THEME_PRESETS = {
    colors: [
        { name: 'Blue', value: '#1677ff' },
        { name: 'Purple', value: '#722ED1' },
        { name: 'Cyan', value: '#13C2C2' },
        { name: 'Green', value: '#52C41A' },
        { name: 'Pink', value: '#EB2F96' },
        { name: 'Red', value: '#F5222D' },
        { name: 'Orange', value: '#FA8C16' },
        { name: 'Yellow', value: '#FADB14' },
    ],
    borderRadius: [
        { name: 'Small', value: 2 },
        { name: 'Medium', value: 6 },
        { name: 'Large', value: 12 },
    ],
};

export const defaultThemeConfig: ThemeConfig = {
    token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
        fontFamily: 'var(--font-geist-sans)',
    },
    components: {
        Button: {
            algorithm: true,
        },
    },
};
