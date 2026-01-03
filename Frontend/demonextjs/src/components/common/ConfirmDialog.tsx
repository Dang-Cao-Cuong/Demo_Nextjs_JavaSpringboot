'use client';

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  variant = 'default',
  isLoading = false,
}: ConfirmDialogProps) {
  // Use Ant Design Modal.confirm when open changes
  if (open && !isLoading) {
    confirm({
      title,
      content: description,
      icon: <ExclamationCircleOutlined />,
      okText: confirmText,
      cancelText,
      okButtonProps: {
        danger: variant === 'destructive',
        loading: isLoading,
      },
      onOk: () => {
        onConfirm();
        onOpenChange(false);
      },
      onCancel: () => {
        onOpenChange(false);
      },
    });
  }

  return null;
}

// Helper function to show confirm dialog programmatically
export const showConfirmDialog = ({
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  variant = 'default',
}: Omit<ConfirmDialogProps, 'open' | 'onOpenChange' | 'isLoading'>) => {
  confirm({
    title,
    content: description,
    icon: <ExclamationCircleOutlined />,
    okText: confirmText,
    cancelText,
    okButtonProps: {
      danger: variant === 'destructive',
    },
    onOk: onConfirm,
  });
};

export default ConfirmDialog;
