'use client';

import { useCallback, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { notification } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { MachineErrorNotification } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export function MachineErrorListener() {
  const queryClient = useQueryClient();
  const lastNotificationRef = useRef<{[key: string]: number}>({});

  // Memoize handleError để tránh re-subscribe
  const handleError = useCallback((error: MachineErrorNotification) => {
    console.log(' Nhận cảnh báo lỗi máy:', error);

    // Debounce: Tránh duplicate trong 3 giây cho cùng 1 máy
    const now = Date.now();
    const lastTime = lastNotificationRef.current[error.machineId] || 0;
    if (now - lastTime < 3000) {
      console.log('⏭ Bỏ qua notification duplicate cho máy:', error.machineId);
      return;
    }
    lastNotificationRef.current[error.machineId] = now;

    // Thêm key duy nhất để tránh duplicate notification
    const notificationKey = `machine-error-${error.machineId}`;

    // Xử lý message (backend gửi 'message', không phải 'errorMessage')
    const displayMessage = error.message || error.errorMessage || 'Lỗi không xác định';
    const errorCode = error.errorCode || 'N/A';

    // Hiển thị notification
    notification.error({
      key: notificationKey,
      message: ` Lỗi máy: ${error.machineName}`,
      description: (
        <div>
          <div>{displayMessage}</div>
          {error.errorCode && <div style={{ fontSize: '12px', marginTop: '4px', color: '#999' }}>Mã lỗi: {errorCode}</div>}
        </div>
      ),
      icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      placement: 'topRight',
      duration: 0, // Không tự đóng
    });

    // Tự động refetch dữ liệu máy để cập nhật trạng thái
    queryClient.invalidateQueries({ queryKey: ['machines'] });
    
    // Nếu có query cho máy cụ thể, cũng invalidate nó
    if (error.machineId) {
      queryClient.invalidateQueries({ queryKey: ['machine', error.machineId] });
    }
    
    console.log(' Đã cập nhật dữ liệu máy');
  }, [queryClient]);

  useWebSocket({
    topic: '/topic/errors',
    onMessage: handleError,
    enabled: true,
  });

  return null; // Component này chỉ lắng nghe, không render gì
}