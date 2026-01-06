'use client';

import { Form, Input, Select, Button, InputNumber, Space } from 'antd';
import { Machine, MachineCreateRequest } from '@/types';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

interface MachineFormProps {
  machine?: Machine;
  onSubmit: (data: MachineCreateRequest) => void;
  isLoading?: boolean;
}

export default function MachineForm({ machine, onSubmit, isLoading }: MachineFormProps) {
  const [form] = Form.useForm();
const { t } = useTranslation();
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
        label={t('machine.label.name')}
        name="name"
        rules={[{ required: true, message: t('machine.form.validation.required', { field: t('machine.label.name') }) }]}
      >
        <Input placeholder={t('machine.form.placeholder.name')} size="large" />
      </Form.Item>

      <Form.Item
        label="Model"
        name="model"
        rules={[{ required: true, message: t('machine.form.validation.required', { field: t('machine.form.model') }) }]}
      >
        <Input placeholder="Nhập model" size="large" />
      </Form.Item>

      <Form.Item
        label={t('machine.label.location').replace(':', '')}
        name="location"
        rules={[{ required: true, message: t('machine.form.validation.required', { field: t('machine.label.location').replace(':', '') }) }]}
      >
        <Input placeholder={t('machine.form.placeholder.location')} size="large" />
      </Form.Item>

      <Form.Item
        label={t('machine.status')}
        name="status"
        rules={[{ required: true, message: t('machine.form.validation.status_required') }]}
      >
        <Select placeholder={t('machine.form.placeholder.status')} size="large">
          <Option value="ACTIVE">{t('machine.label.status.ACTIVE')}</Option>
          <Option value="INACTIVE">{t('machine.label.status.INACTIVE')}</Option>
          <Option value="MAINTENANCE">{t('machine.label.status.MAINTENANCE')}</Option>
          <Option value="ERROR">{t('machine.label.status.ERROR')}</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t('machine.label.manufacturing_year').replace(':', '')}
        name="manufactureYear"
        rules={[
          { required: true, message: t('machine.form.validation.required', { field: t('machine.label.manufacturing_year').replace(':', '') }) },
          { type: 'number', min: 1900, max: new Date().getFullYear(), message: t('machine.form.validation.year_range') }
        ]}
      >
        <InputNumber
          placeholder={t('machine.form.placeholder.manufacture_year')}
          style={{ width: '100%' }}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading} size="large">
            {machine ? t('machine.form.button.update') : t('machine.form.button.create')}
          </Button>
          <Button htmlType="reset" size="large">
            {t('machine.form.button.reset')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
