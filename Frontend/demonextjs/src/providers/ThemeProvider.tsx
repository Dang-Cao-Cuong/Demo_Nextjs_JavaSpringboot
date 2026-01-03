'use client';

import { ConfigProvider, theme, App } from 'antd';
import { ReactNode } from 'react';
import viVN from 'antd/locale/vi_VN';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: 'var(--font-geist-sans)',
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <App>
        {children}
      </App>
    </ConfigProvider>
  );
}
