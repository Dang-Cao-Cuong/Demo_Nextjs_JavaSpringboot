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

interface MachineDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function MachineDetailPage({ params }: MachineDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { machine, isLoading, error } = useMachine(id);
    const { deleteMachine, isDeleting } = useMachines();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeleteConfirm = () => {
        deleteMachine(id);
        setShowDeleteDialog(false);
        router.push('/machines');
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" tip="Đang tải thông tin máy..." />
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div style={{ padding: '24px' }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    style={{ marginBottom: '16px' }}
                >
                    Quay lại
                </Button>
                <Empty
                    description="Không tìm thấy máy hoặc đã xảy ra lỗi."
                    style={{ marginTop: '40px' }}
                >
                    <Button type="primary" onClick={() => router.push('/machines')}>
                        Về danh sách máy
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
                        Chỉnh sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        Xóa
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
                            Thông tin máy
                        </span>
                    }
                    style={{ gridColumn: 'span 2' }}
                >
                    <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
                        <Descriptions.Item label="Tên máy">
                            {machine.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Model">
                            {machine.model}
                        </Descriptions.Item>
                        <Descriptions.Item label="Năm sản xuất">
                            {machine.manufactureYear}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vị trí">
                            <Space>
                                <EnvironmentOutlined />
                                {machine.location}
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Ngày tạo">
                            <Space>
                                <CalendarOutlined />
                                {machine.createdAt 
                                    ? format(new Date(machine.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                                    : 'N/A'
                                }
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Cập nhật lần cuối">
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
                            Trạng thái
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
