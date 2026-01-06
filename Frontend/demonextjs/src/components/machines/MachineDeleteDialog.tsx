'use client';

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
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
   const { t } = useTranslation();
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          {t('machine.delete_confirm.title')}
        </span>
      }
      open={open}
      onOk={onConfirm}
      onCancel={() => onOpenChange(false)}
      okText={t('machine.delete')}
      cancelText={t('machine.cancel')}
      okButtonProps={{ danger: true, loading }}
    >
      <p>
         {t('machine.delete_confirm.message')} <strong>{machineName}</strong>?
      </p>
      <p style={{ color: '#666' }}> {t('machine.delete_confirm.warning')} .</p>
    </Modal>
  );
}
