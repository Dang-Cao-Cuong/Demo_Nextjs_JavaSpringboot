'use client';

import { Form, Input, Select, Button, InputNumber, Space } from 'antd';
import { Machine, MachineCreateRequest } from '@/types';
import { useEffect } from 'react';

const { Option } = Select;

interface MachineFormProps {
  machine?: Machine;
  onSubmit: (data: MachineCreateRequest) => void;
  isLoading?: boolean;
}

export default function MachineForm({ machine, onSubmit, isLoading }: MachineFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (machine) {
      form.setFieldsValue({
        name: machine.name,
        model: machine.model,
        location: machine.location,
        status: machine.status,
        manufactureYear: machine.manufactureYear,
      });
    }
  }, [machine, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        model: '',
        location: '',
        status: 'ACTIVE',
        manufactureYear: new Date().getFullYear(),
      }}
    >
      <Form.Item
        label="Tên máy"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên máy' }]}
      >
        <Input placeholder="Nhập tên máy" size="large" />
      </Form.Item>

      <Form.Item
        label="Model"
        name="model"
        rules={[{ required: true, message: 'Vui lòng nhập model' }]}
      >
        <Input placeholder="Nhập model" size="large" />
      </Form.Item>

      <Form.Item
        label="Vị trí"
        name="location"
        rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
      >
        <Input placeholder="Nhập vị trí" size="large" />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="Chọn trạng thái" size="large">
          <Option value="ACTIVE">Active</Option>
          <Option value="INACTIVE">Inactive</Option>
          <Option value="MAINTENANCE">Maintenance</Option>
          <Option value="RETIRED">Retired</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Năm sản xuất"
        name="manufactureYear"
        rules={[
          { required: true, message: 'Vui lòng nhập năm sản xuất' },
          { type: 'number', min: 1900, max: new Date().getFullYear(), message: 'Năm không hợp lệ' }
        ]}
      >
        <InputNumber
          placeholder="Nhập năm sản xuất"
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">
            {machine ? 'Cập nhật' : 'Tạo mới'}
          </Button>
          <Button htmlType="reset" size="large">
            Đặt lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
