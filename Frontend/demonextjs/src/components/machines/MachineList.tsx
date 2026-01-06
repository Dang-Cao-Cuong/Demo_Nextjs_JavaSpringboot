'use client';

import { Machine } from '@/types';
import MachineCard from './MachineCard';
import MachineFilter from "./machineFilter"
import { Row, Col, Pagination, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
interface MachineListProps {
  machines: Machine[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onEdit: (machine: Machine) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: any) => void;
  onView?: (id: string) => void;
}

export default function MachineList({
  machines,
  totalPages,
  currentPage,
  totalElements,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onFilterChange,
  onView,
}: MachineListProps) {
     const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Bộ lọc */}
      <MachineFilter onFilterChange={onFilterChange} />

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
                showTotal={(total) => {t('machine.total_count')}}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
