'use client';

import { useRouter } from 'next/navigation';
import { Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMachines } from '@/hooks/useMachine';
import MachineForm from '@/components/machines/machineForm';
import { MachineCreateRequest } from '@/types';

export default function NewMachinePage() {
  const router = useRouter();
  const { createMachine, isCreating } = useMachines();

  const handleSubmit = (data: MachineCreateRequest) => {
    createMachine(data, {
      onSuccess: () => {
        router.push('/machines');
      },
    });
  };

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
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Tạo máy mới</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          Nhập thông tin để tạo máy mới
        </p>
      </div>

      {/* Form */}
      <Card>
        <MachineForm onSubmit={handleSubmit} isLoading={isCreating} />
      </Card>
    </div>
  );
}
