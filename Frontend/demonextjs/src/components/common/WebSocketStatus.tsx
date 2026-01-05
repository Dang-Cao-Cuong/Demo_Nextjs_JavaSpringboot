'use client';

import { Badge } from 'antd';
import { useWebSocketContext } from '@/providers/WebSocketProvider';

export function WebSocketStatus() {
  const { isConnected } = useWebSocketContext();

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
      <Badge
        status={isConnected ? 'success' : 'error'}
        text={isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
      />
    </div>
  );
}