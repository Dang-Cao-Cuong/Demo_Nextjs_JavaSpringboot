'use client';

import { useWebSocket } from '@/hooks/useWebSocket';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Component lắng nghe cập nhật trạng thái máy từ WebSocket
 * Subscribe vào /topic/status hoặc /topic/updates để nhận cập nhật real-time
 */
export function MachineStatusListener() {
  const queryClient = useQueryClient();

  const handleStatusUpdate = (data: any) => {
    console.log(' Nhận cập nhật trạng thái máy:', data);

    // Refetch toàn bộ danh sách máy
    queryClient.invalidateQueries({ queryKey: ['machines'] });

    // Nếu có machineId cụ thể, cũng refetch riêng máy đó
    if (data.machineId) {
      queryClient.invalidateQueries({ queryKey: ['machine', data.machineId] });
    }

    console.log(' Đã cập nhật dữ liệu máy từ status update');
  };

  // Subscribe vào topic status updates (nếu backend có cung cấp)
  useWebSocket({
    topic: '/topic/status',
    onMessage: handleStatusUpdate,
    enabled: true,
  });

  return null; // Component này chỉ lắng nghe, không render gì
}
