'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Input, Button, Select, Card, Switch, Form } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MachineFilterParams } from '@/types';
interface MachineFilterProps {
  initialFilters?: MachineFilterParams;
  onFilterChange: (filters: MachineFilterParams) => void;
}

export function MachineFilter({ initialFilters, onFilterChange }: MachineFilterProps) {
  const [filters, setFilters] = useState({
    name: initialFilters?.name || '',
    model: initialFilters?.model || '',
    location: initialFilters?.location || '',
    status: initialFilters?.status || '',
    showDeleted: initialFilters?.showDeleted || false,
  });
  const { t } = useTranslation();
  // Auto-apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = useCallback((key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      name: '',
      model: '',
      location: '',
      status: '',
      showDeleted: false,
    });
  }, []);

  const statusOptions = [
    { label: t('machine.filter.all_statuses'), value: '' },
    { label: t('machine.label.status.ACTIVE'), value: 'ACTIVE' },
    { label: t('machine.label.status.INACTIVE'), value: 'INACTIVE' },
    { label: t('machine.label.status.MAINTENANCE'), value: 'MAINTENANCE' },
    { label: t('machine.label.status.ERROR'), value: 'ERROR' },
  ];
  return (
    <Card title={t('machine.filter.title')} style={{ marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* Name */}
        <Input
          placeholder={t('machine.filter.search_name')}
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          allowClear
        />

        {/* Model */}
        <Input
          placeholder={t('machine.filter.search_model')}
          value={filters.model}
          onChange={(e) => handleFilterChange('model', e.target.value)}
          allowClear
        />

        {/* Location */}
        <Input
          placeholder={t('machine.filter.search_location')}
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          allowClear
        />

        {/* Status */}
        <Select
          placeholder={t('machine.filter.select_status')}
          value={filters.status || undefined}
          onChange={(value) => handleFilterChange('status', value || '')}
          allowClear
          style={{ width: '100%' }}
          options={statusOptions}
        />

        {/* Show Deleted Toggle */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>{t('machine.filter.show_deleted', 'Hiển thị máy đã xóa')}:</span>
          <Switch
            checked={filters.showDeleted}
            onChange={(checked) => handleFilterChange('showDeleted', checked)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
          {t('machine.filter.reset')}
        </Button>
      </div>
    </Card>
  );
}

export default memo(MachineFilter);
