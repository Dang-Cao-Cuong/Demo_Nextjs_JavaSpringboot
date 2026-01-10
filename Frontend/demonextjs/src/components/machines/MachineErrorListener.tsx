'use client';

import { useCallback, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { App } from 'antd';
// import { WarningOutlined } from '@ant-design/icons';
import { MachineErrorNotification } from '@/types';
// import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { updateMachineRealtime } from '@/redux/slices/machineSlice';

export const MachineErrorListener = () => {

  // const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const lastNotificationRef = useRef<{ [key: string]: number }>({});
  const { t } = useTranslation();
  const { notification } = App.useApp(); // Use hook-based notification

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
      //  Sử dụng translation
      notification.error({
        title: t('notification.machineError', { machineName: error.machineName }),
        description: description,
      });

      // Update Redux Store Realtime
      dispatch(updateMachineRealtime({
        id: error.machineId,
        status: 'ERROR',
        // could update other fields if provided
      }));

      // Tự động refetch dữ liệu máy (Optional now since we updated realtime, but good for consistency)
      // queryClient.invalidateQueries({ queryKey: ['machines'] });
      // queryClient.invalidateQueries({ queryKey: ['machine', error.machineId] });

      console.log(' Đã cập nhật dữ liệu máy (Redux)');
    },
    [dispatch, t, notification]
  );
  useWebSocket({
    topic: '/topic/errors',
    onMessage: handleError,
    enabled: true,
  });

  return null; // Component này chỉ lắng nghe, không render gì
}