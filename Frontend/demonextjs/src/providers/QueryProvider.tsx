'use client';

import { useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Không retry khi lỗi 401 (unauthorized)
            retry: (failureCount, error: unknown) => {
              if (
                error &&
                typeof error === 'object' &&
                'response' in error &&
                (error as { response?: { status?: number } }).response?.status === 401
              ) {
                return false;
              }
              return failureCount < 3;
            },
            // Cache data trong 5 phút
            staleTime: 5 * 60 * 1000,
            // Giữ data trong cache 10 phút
            gcTime: 10 * 60 * 1000,
            // Refetch khi window focus
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Retry mutations 1 lần
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;
