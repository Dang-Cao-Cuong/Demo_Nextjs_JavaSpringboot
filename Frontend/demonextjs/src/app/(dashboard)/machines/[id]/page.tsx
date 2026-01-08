'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    SettingOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { Card, Button, Spin, Empty, Descriptions, Space, Divider } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { MachineStatusBadge } from '@/components/machines/machineStatusBadge';
import MachineDeleteDialog from '@/components/machines/MachineDeleteDialog';
import { useMachine } from '@/hooks/useMachine';
import { useMachines } from '@/hooks/useMachine';
import { useTranslation } from 'react-i18next';
interface MachineDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function MachineDetailPage({ params }: MachineDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { machine, isLoading, error } = useMachine(id);
    const { deleteMachine, isDeleting } = useMachines();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { t } = useTranslation();
    const handleDeleteConfirm = () => {
        deleteMachine(id);
        setShowDeleteDialog(false);
        router.push('/machines');
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
                <Spin size="large" />
                <div>{t('machine.label.loading')}</div>
            </div>
        );
    }

    if (error || !machine) {
        console.log(machine);
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
                    style={{ marginTop: '40px' }}
                >
                    <Button type="primary" onClick={() => router.push('/machines')}>
                        {t('machine.label.back_to_list')}
                    </Button>
                </Empty>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.back()}
                        type="text"
                    />
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        margin: 0,
                        color: '#1f2937'
                    }}>
                        {machine.name}
                    </h1>
                </div>
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/machines/${id}/edit`)}
                    >
                        {t('common.edit')}
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        {t('common.delete')}
                    </Button>
                </Space>
            </div>

            {/* Main Content */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
            }}>
                {/* Machine Information Card */}
                <Card
                    title={
                        <span>
                            <SettingOutlined style={{ marginRight: '8px' }} />
                            {t('machine.label.title')}
                        </span>
                    }
                    style={{ gridColumn: 'span 2' }}
                >
                    <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                        <Descriptions.Item label={t('machine.label.name')}>
                            {machine.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Model">
                            {machine.model}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('machine.label.manufacturing_year')}>
                            {machine.manufactureYear}
                        </Descriptions.Item>
                        <Descriptions.Item label={t('machine.label.location')}>
                            <Space>
                                <EnvironmentOutlined />
                                {machine.location}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label={t('machine.label.created_at')}>
                            <Space>
                                <CalendarOutlined />
                                {machine.createdAt
                                    ? format(new Date(machine.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                                    : 'N/A'
                                }
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label={t('machine.label.updated_at')}>
                            <Space>
                                <CalendarOutlined />
                                {machine.updatedAt
                                    ? format(new Date(machine.updatedAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                                    : 'N/A'
                                }
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Status Card */}
                <Card
                    title={
                        <span>
                            <DashboardOutlined style={{ marginRight: '8px' }} />
                            {t('machine.status')}
                        </span>
                    }
                    style={{ height: 'fit-content' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                        <MachineStatusBadge status={machine.status} />
                    </div>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <MachineDeleteDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDeleteConfirm}
                machineName={machine.name}
                loading={isDeleting}
            />
        </div>
    );
}
