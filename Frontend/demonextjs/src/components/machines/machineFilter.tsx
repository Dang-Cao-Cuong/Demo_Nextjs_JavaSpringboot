'use client';

import { useState, useEffect } from 'react';
import { Input, Button, Select, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface MachineFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function MachineFilter({ onFilterChange }: MachineFilterProps) {
  const [filters, setFilters] = useState({
    name: '',
    model: '',
    location: '',
    status: '',
  });

  // Auto-apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      model: '',
      location: '',
      status: '',
    });
  };

  return (
    <Card title="Bộ lọc" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {/* Name */}
        <Input
          placeholder="Tìm theo tên"
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          allowClear
        />

        {/* Model */}
        <Input
          placeholder="Tìm theo model"
          value={filters.model}
          onChange={(e) => handleFilterChange('model', e.target.value)}
          allowClear
        />

        {/* Location */}
        <Input
          placeholder="Tìm theo vị trí"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          allowClear
        />

        {/* Status */}
        <Select
          placeholder="Chọn trạng thái"
          value={filters.status || undefined}
          onChange={(value) => handleFilterChange('status', value || '')}
          allowClear
          style={{ width: '100%' }}
          options={[
            { label: 'Tất cả', value: '' },
            { label: 'Hoạt động', value: 'ACTIVE' },
            { label: 'Không hoạt động', value: 'INACTIVE' },
            { label: 'Bảo trì', value: 'MAINTENANCE' },
            { label: 'Lỗi', value: 'ERROR' },
          ]}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
          Reset bộ lọc
        </Button>
      </div>
    </Card>
  );
}
