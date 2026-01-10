'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Spin, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useMachines } from '@/hooks/useMachine';
import MachineList from '@/components/machines/MachineList';
import MachineDeleteDialog from '@/components/machines/MachineDeleteDialog';
import MachineForm from '@/components/machines/MachineForm';
import { Machine, MachineFilterParams, MachineCreateRequest } from '@/types';

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
    createMachine,
    isCreating,
    updateMachine,
    isUpdating,
  } = useMachines();

  console.log('Machines list:', machines);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [selectedMachineForEdit, setSelectedMachineForEdit] = useState<Machine | null>(null);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setFilters((prev) => ({ ...prev, page, size: pageSize }));
  }, [setFilters]);

  const handleFilterChange = useCallback((newFilters: MachineFilterParams) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 }));
  }, [setFilters]);

  const handleEdit = useCallback((machine: Machine) => {
    setSelectedMachineForEdit(machine);
    setEditModalOpen(true);
  }, []);

  const handleView = useCallback((id: string) => {
    router.push(`/machines/${id}`);
  }, [router]);

  const handleDeleteClick = useCallback((id: string) => {
    const machine = machines.find((m) => m.id === id);
    if (machine) {
      setSelectedMachine(machine);
      setDeleteDialogOpen(true);
    }
  }, [machines]);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedMachine) {
      deleteMachine(selectedMachine.id);
      setDeleteDialogOpen(false);
      setSelectedMachine(null);
    }
  }, [selectedMachine, deleteMachine]);

  const handleCreateClick = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = (data: MachineCreateRequest) => {
    createMachine(data, {
      onSuccess: () => {
        setCreateModalOpen(false);
      },
    });
  };

  const handleEditSubmit = (data: MachineCreateRequest) => {
    if (selectedMachineForEdit) {
      updateMachine(
        { id: selectedMachineForEdit.id, data },
        {
          onSuccess: () => {
            setEditModalOpen(false);
            setSelectedMachineForEdit(null);
          },
        }
      );
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
              onClick={handleCreateClick}
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

        {/* Create Modal */}
        <Modal
          title={t('machine.create_button')}
          open={createModalOpen}
          onCancel={() => setCreateModalOpen(false)}
          footer={null}
          destroyOnHidden
        >
          <MachineForm
            onSubmit={handleCreateSubmit}
            isLoading={isCreating}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          title={t('machine.form.update_title')}
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedMachineForEdit(null);
          }}
          footer={null}
          destroyOnHidden
        >
          <MachineForm
            machine={selectedMachineForEdit || undefined}
            onSubmit={handleEditSubmit}
            isLoading={isUpdating}
          />
        </Modal>

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
