'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMachine, useMachines } from '@/hooks/useMachine';
import MachineForm from '@/components/machines/machineForm';
import { MachineUpdateRequest } from '@/types';

export default function EditMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { machine, isLoading } = useMachine(id);
  const { updateMachine, isUpdating } = useMachines();

  const handleSubmit = (data: MachineUpdateRequest) => {
    updateMachine(
      { id, data },
      {
        onSuccess: () => {
          router.push('/machines');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!machine) {
    return (
      <div style={{ padding: '24px' }}>
        <Empty description="Không tìm thấy máy" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Chỉnh sửa máy</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          Cập nhật thông tin máy {machine.name}
        </p>
      </div>

      {/* Form */}
      <Card 
        style={{ 
          border: '2px solid #d9d9d9',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <MachineForm
          machine={machine}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </Card>
    </div>
  );
}
