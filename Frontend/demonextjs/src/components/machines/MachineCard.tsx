'use client';

import { Machine } from '@/types';
import { Card, Button, Tag, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface MachineCardProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'default';
    case 'MAINTENANCE':
      return 'warning';
    case 'RETIRED':
      return 'error';
    default:
      return 'default';
  }
};

export default function MachineCard({ machine, onEdit, onDelete }: MachineCardProps) {
  return (
    <Card
      hoverable
      actions={[
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit(machine)}
        >
          Sửa
        </Button>,
        <Button
          key="delete"
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(machine.id)}
        >
          Xóa
        </Button>,
      ]}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>{machine.name}</h3>
          <Tag color={getStatusColor(machine.status)}>{machine.status}</Tag>
        </div>
        <div style={{ color: '#666' }}>
          <div><strong>Model:</strong> {machine.model}</div>
          <div><strong>Vị trí:</strong> {machine.location}</div>
          <div><strong>Năm SX:</strong> {machine.manufactureYear}</div>
        </div>
      </Space>
    </Card>
  );
}
