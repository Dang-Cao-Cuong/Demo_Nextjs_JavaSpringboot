'use client';

import { ConfigProvider, theme, App } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import viVN from 'antd/locale/vi_VN';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import { useThemeStore } from '@/stores/themeStore';
import { defaultThemeConfig } from '@/configs/themeConfig';

interface ThemeProviderProps {
  children: ReactNode;
}

const AntdConfigProvider = ({ children }: { children: ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const { colorPrimary, borderRadius, compactMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ConfigProvider theme={defaultThemeConfig} locale={viVN}>
        <App>
          <div style={{ visibility: 'hidden' }}>{children}</div>
        </App>
      </ConfigProvider>
    );
  }

  const getAlgorithm = () => {
    const algorithms = [resolvedTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm];

    if (compactMode) {
      algorithms.push(theme.compactAlgorithm);
    }
    return algorithms;
  };

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        ...defaultThemeConfig,
        token: {
          ...defaultThemeConfig.token,
          colorPrimary,
          borderRadius,
        },
        algorithm: getAlgorithm(),
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </NextThemeProvider>
  );
}
