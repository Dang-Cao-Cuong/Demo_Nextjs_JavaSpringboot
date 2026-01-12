'use client';

import { Machine } from '@/types';
import { Card, Button, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MachineStatusBadge } from './machineStatusBadge';


interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function MachineCard({ machine, onEdit, onDelete, onRestore, onView }: MachineCardProps) {
  const { t } = useTranslation();

  const actions = machine.deleted ? [
    <Button
      key="restore"
      type="link"
      icon={<UndoOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        onRestore?.(machine.id);
      }}
    >
      {t('common.restore')}
    </Button>
  ] : [
    <Button
      key="edit"
      type="link"
      icon={<EditOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        onEdit(machine);
      }}
    >
      {t('common.edit')}
    </Button>,
    <Button
      key="delete"
      type="link"
      danger
      icon={<DeleteOutlined />}
      onClick={(e) => {
        e.stopPropagation();
        onDelete(machine.id);
      }}
    >
      {t('common.delete')}
    </Button>,
  ];

  return (
    <Card
      hoverable
      onClick={() => onView?.(machine.id)}
      style={{ cursor: 'pointer' }}
      actions={actions}
    >
      <Space vertical size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{machine.name}</h3>
            {machine.deleted && <Tag color="error">{t('matrix.label.deleted', 'Đã xóa')}</Tag>}
          </div>

          <MachineStatusBadge status={machine.status} />
        </div>

        <div style={{ color: '#666' }}>
          <div><strong>Model:</strong> {machine.model}</div>
          <div><strong>{t('machine.label.location')}</strong> {machine.location}</div>
          <div><strong>{t('machine.label.manufacturing_year')}</strong> {machine.manufactureYear}</div>
        </div>
      </Space>
    </Card>
  );
}