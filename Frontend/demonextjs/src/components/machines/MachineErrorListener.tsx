'use client';

import { useCallback, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { notification } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { MachineErrorNotification } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';


export const MachineErrorListener = () => {

  const queryClient = useQueryClient();
  const lastNotificationRef = useRef<{ [key: string]: number }>({});
  const { t } = useTranslation();

  const handleError = useCallback(
    (error: MachineErrorNotification) => {
      console.log(' Nhận cảnh báo lỗi máy:', error);

      const now = Date.now();
      const lastTime = lastNotificationRef.current[error.machineId] || 0;

      // Debounce: Bỏ qua nếu cùng máy trong vòng 3 giây
      if (now - lastTime < 3000) {
        console.log('⏭ Bỏ qua duplicate notification');
        return;
      }

      lastNotificationRef.current[error.machineId] = now;

      const message = error.message || error.errorMessage || t('notification.machineError', { machineName: error.machineName });

      const description = error.errorCode
        ? t('notification.machineErrorDesc', { message, errorCode: error.errorCode })
        : `Cảnh báo từ RabbitMQ: ${message}`;

      //  Sử dụng translation
      notification.error({
        message: t('notification.machineError', { machineName: error.machineName }),
        description: description,
        placement: 'topRight',
        duration: 0,
        key: error.machineId,
      });

      // Tự động refetch dữ liệu máy
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      queryClient.invalidateQueries({ queryKey: ['machine', error.machineId] });

      console.log(' Đã cập nhật dữ liệu máy');
    },
    [queryClient, t] //  Thêm t vào dependencies
  );
  useWebSocket({
    topic: '/topic/errors',
    onMessage: handleError,
    enabled: true,
  });

  return null; // Component này chỉ lắng nghe, không render gì
}