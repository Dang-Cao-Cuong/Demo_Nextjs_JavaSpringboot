'use client';

import { Machine } from '@/types';
import { Card, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import MachineStatusBadge from './machineStatusBadge'; 

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export default function MachineCard({ machine, onEdit, onDelete, onView }: MachineCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      hoverable
      onClick={() => onView?.(machine.id)}
      style={{ cursor: 'pointer' }}
      actions={[
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
      ]}
    >
      <Space vertical size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{machine.name}</h3>
          
   
          <MachineStatusBadge status={machine.status} />
        </div>
        
        <div style={{ color: '#666' }}>
          <div><strong>Model:</strong> {machine.model}</div>
          <div><strong>{t('machine.label.location')}:</strong> {machine.location}</div>
          <div><strong>{t('machine.label.manufacturing_year')}:</strong> {machine.manufactureYear}</div>
        </div>
      </Space>
    </Card>
  );
}