'use client';

import { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { LoginRequest } from '@/services/api/auth.api';

const { Title, Text } = Typography;



export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm<LoginRequest>();
  const { login } = useAuth();

  const handleSubmit = async (values: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await login(values);
      message.success('Đăng nhập thành công!');
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMsg);
      message.error(errorMsg);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className="w-full max-w-md"
      title={
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng Nhập</h1>
          <p className="text-sm text-gray-500 mt-1">Hệ thống quản lý máy CNC</p>
        </div>
      }
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError('')}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          username: '',
          password: ''
        }}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="username"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="username"
            disabled={isLoading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: "Mật khẩu có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            size="large"
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isLoading}
            icon={!isLoading && <LoginOutlined />}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>hoặc</Divider>

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">Chưa có tài khoản? </Text>
        <Link href="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
          Đăng ký ngay
        </Link>
      </div>
    </Card>
  );
}
