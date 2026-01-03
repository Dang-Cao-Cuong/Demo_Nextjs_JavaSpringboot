'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    SettingOutlined,
    ShopOutlined,
    DashboardOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { MachineStatusBadge } from '@/components/machines/machineStatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useMachine, useDeleteMachine } from '@/hooks/useMachine';
import { useState } from 'react';

interface MachineDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function MachineDetailPage({ params }: MachineDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data: machine, isLoading, error } = useMachine(id);
    const deleteMachine = useDeleteMachine();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        deleteMachine.mutate(id, {
            onSuccess: () => {
                router.push('/machines');
            },
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeftOutlined className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Không tìm thấy máy hoặc đã xảy ra lỗi.
                        </p>
                        <Button className="mt-4" asChild>
                            <Link href="/machines">Về danh sách máy</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeftOutlined className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {machine.name}
                        </h1>

                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={`/machines/${id}/edit`}>
                            <EditOutlined className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Link>
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <DeleteOutlined className="mr-2 h-4 w-4" />
                        Xóa
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SettingOutlined className="h-5 w-5" />
                            Thông tin máy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tên máy</p>
                                <p className="font-medium">{machine.name}</p>
                            </div>
                           
                            <div>
                                <p className="text-sm text-muted-foreground">Model</p>
                                <p className="font-medium">{machine.model}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Năm sản xuất</p>
                                <p className="font-medium">{machine.manufacture_year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Vị trí</p>
                                <p className="font-medium flex items-center gap-1">
                                    <EnvironmentOutlined className="h-4 w-4" />
                                    {machine.location}
                                </p>
                            </div>
                        </div>

                        <Separator />



                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Ngày tạo</p>
                                <p className="font-medium flex items-center gap-1">
                                    <CalendarOutlined className="h-4 w-4" />
                                    {format(new Date(machine.created_at), 'dd/MM/yyyy HH:mm', {
                                        locale: vi,
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Cập nhật lần cuối</p>
                                <p className="font-medium flex items-center gap-1">
                                    <CalendarOutlined className="h-4 w-4" />
                                    {format(new Date(machine.updated_at), 'dd/MM/yyyy HH:mm', {
                                        locale: vi,
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DashboardOutlined className="h-5 w-5" />
                                Trạng thái
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MachineStatusBadge status={machine.status} className="text-lg" />
                        </CardContent>
                    </Card>



                </div>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Xác nhận xóa máy"
                description={`Bạn có chắc chắn muốn xóa máy "${machine.name}"? Hành động này không thể hoàn tác.`}
                confirmText="Xóa máy"
                onConfirm={handleDelete}
                variant="destructive"
                isLoading={deleteMachine.isPending}
            />
        </div>
    );
}
