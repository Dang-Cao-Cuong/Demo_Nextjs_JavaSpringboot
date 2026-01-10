'use client';

import { memo } from 'react';
import { Machine, MachineFilterParams } from '@/types';
import MachineCard from './MachineCard';
import MachineFilter from "./MachineFilter"
import { Row, Col, Pagination, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
interface MachineListProps {
  machines: Machine[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  currentFilters: MachineFilterParams;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (machine: Machine) => void;

  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onFilterChange: (filters: MachineFilterParams) => void;
  onView?: (id: string) => void;
}

export function MachineList({
  machines,
  totalPages,
  currentPage,
  totalElements,
  pageSize,
  currentFilters,
  onPageChange,
  onEdit,
  onDelete,
  onRestore,
  onFilterChange,
  onView,
}: MachineListProps) {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Bộ lọc */}
      <MachineFilter initialFilters={currentFilters} onFilterChange={onFilterChange} />

      {/* Danh sách machines */}
      {machines.length === 0 ? (
        <Empty description={t('machine.empty_list')} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {machines.map((machine) => (
              <Col xs={24} sm={12} lg={8} key={machine.id}>
                <MachineCard
                  machine={machine}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRestore={onRestore}
                  onView={onView}
                />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Pagination
                current={currentPage + 1}
                total={totalElements}
                pageSize={pageSize}
                onChange={(page, pageSize) => onPageChange(page - 1, pageSize)}
                showSizeChanger
                showTotal={(total) => t('machine.total_count')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default memo(MachineList);
