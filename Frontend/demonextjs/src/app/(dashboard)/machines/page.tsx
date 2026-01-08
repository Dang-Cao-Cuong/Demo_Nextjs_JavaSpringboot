'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMachines } from '@/hooks/useMachine';
import MachineList from '@/components/machines/MachineList';
import MachineDeleteDialog from '@/components/machines/MachineDeleteDialog';
import { Machine } from '@/types';
import { MachineErrorListener } from '@/components/machines/MachineErrorListener';
import { useTranslation } from 'react-i18next';
export default function MachinesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    machines,
    totalPages,
    currentPage,
    totalElements,
    isLoading,
    filters,
    setFilters,
    deleteMachine,
    isDeleting,
  } = useMachines();

  console.log('Machines list:', machines);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page, size: pageSize }));
  }, []);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  }, []);

  const handleEdit = (machine: Machine) => {
    router.push(`/machines/${machine.id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/machines/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    const machine = machines.find((m) => m.id === id);
    if (machine) {
      setSelectedMachine(machine);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedMachine) {
      deleteMachine(selectedMachine.id);
      setDeleteDialogOpen(false);
      setSelectedMachine(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      <MachineErrorListener />
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{t('machine.title')}</h1>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                {t('machine.description')}

              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => router.push('/machines/new')}
            >
              {t('machine.create_button')}
            </Button>
          </div>
        </Card>

        {/* Machine List */}
        <MachineList
          machines={machines}
          totalPages={totalPages}
          currentPage={currentPage}
          totalElements={totalElements}
          pageSize={filters.size || 10}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onFilterChange={handleFilterChange}
          onView={handleView}
        />

        {/* Delete Dialog */}
        <MachineDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          machineName={selectedMachine?.name || ''}
          loading={isDeleting}
        />
      </div>
    </>
  );
}
