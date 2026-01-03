import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider as ZustandAuthProvider } from "@/providers/AuthProvider";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import AntdRegistry from "./antd-registry";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quản lý máy CNC",
  description: "Hệ thống quản lý máy CNC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ThemeProvider>
            <ErrorBoundary>
              <QueryProvider>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </QueryProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

