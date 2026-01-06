'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useMachine, useMachines } from '@/hooks/useMachine';
import MachineForm from '@/components/machines/machineForm';
import { MachineUpdateRequest } from '@/types';
import { useTranslation } from 'react-i18next';
export default function EditMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { machine, isLoading } = useMachine(id);
  const { updateMachine, isUpdating } = useMachines();
  const { t } = useTranslation();
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
        <Spin size="large" tip={t('common.loading')} />
      </div>
    );
  }

  if (!machine) {
    return (
      <div style={{ padding: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: '16px' }}
        >
         {t('common.back')}
        </Button>
        <Empty 
          description={
            <>
              <div>{t('machine.label.not_found_title')}</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                {t('machine.label.not_found_desc')}
              </div>
            </>
          } 
        />
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
          {t('common.back')}
        </Button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{t('machine.form.update_title')}</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
         {t('machine.form.update_subtitle', { name: machine.name })}
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
