'use client';

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface MachineDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  machineName: string;
  loading?: boolean;
}

export default function MachineDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  machineName,
  loading,
}: MachineDeleteDialogProps) {
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          Xác nhận xóa
        </span>
      }
      open={open}
      onOk={onConfirm}
      onCancel={() => onOpenChange(false)}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true, loading }}
    >
      <p>
        Bạn có chắc chắn muốn xóa máy <strong>{machineName}</strong>?
      </p>
      <p style={{ color: '#666' }}>Hành động này không thể hoàn tác.</p>
    </Modal>
  );
}
