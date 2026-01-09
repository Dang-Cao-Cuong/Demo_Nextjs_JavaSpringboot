import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider as ZustandAuthProvider } from "@/providers/AuthProvider";
import { AuthProvider } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import AntdRegistry from "./antd-registry";
import { App } from "antd";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { I18nextProvider } from "@/providers/I18nextProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { MachineErrorListener } from "@/components/machines/MachineErrorListener";

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
        <I18nextProvider>
          <AntdRegistry>
            <ThemeProvider>
              <App>
                <ErrorBoundary>
                  <QueryProvider>
                    <AuthProvider>
                      <WebSocketProvider>
                        <MachineErrorListener />
                        {children}
                      </WebSocketProvider>
                    </AuthProvider>
                  </QueryProvider>
                </ErrorBoundary>
              </App>
            </ThemeProvider>
          </AntdRegistry>
        </I18nextProvider>
      </body>
    </html>
  );
}