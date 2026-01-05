'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { websocketService } from '@/services/websocket/websocketService';
import { message } from 'antd';

interface WebSocketContextValue {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within WebSocketProvider');
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // Lấy token từ localStorage hoặc cookie
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error(' Không tìm thấy token');
        return;
      }

      await websocketService.connect(token);
      setIsConnected(true);
      message.success('Kết nối WebSocket thành công');
    } catch (error) {
      console.error(' Lỗi kết nối WebSocket:', error);
      message.error('Không thể kết nối WebSocket');
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    websocketService.disconnect();
    setIsConnected(false);
  };

  // Auto-connect khi mount
  useEffect(() => {
    connect();

    // Cleanup khi unmount
    return () => {
      disconnect();
    };
  }, []);

  // Reconnect khi token thay đổi
  useEffect(() => {
    const handleStorageChange = () => {
      if (isConnected) {
        disconnect();
        setTimeout(connect, 1000);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isConnected]);

  return (
    <WebSocketContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </WebSocketContext.Provider>
  );
}