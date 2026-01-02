'use client';

import { useState } from "react";
import { Form, Input, Button as AntButton, Card as AntCard, App, Alert, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, LoadingOutlined } from '@ant-design/icons';
import { LoginFormData } from '@/lib/validations/auth.schema';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from "next/navigation";
import { email } from "zod";
import FormItem from "antd/es/form/FormItem";
import { is } from "zod/v4/locales";
const { Title, Text } = Typography;



export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm<LoginFormData>();
  const { login } = useAuth();
  const router = useRouter()
  const handleSubmit = async (values: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {

      //await login(values);
      router.push("./home")
      console.log('Login successful');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AntCard
      className="w-full max-w-md"
      title={
        <div className="text-center">
          <h1 className="text-2x1 font-bold">Đăng Nhập</h1>
          <p className="text-sm text-gray-500 mt-1">hệ thống quản lý máy CNC</p>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          email: '',
          password: ""
        }}>
        <Form.Item
          label="Email"
          name="Email"
          rules={[
            { required: true, message: "vui lòng nhập email" },
            { type: "email", message: "email không hợp lệ" },
          ]}
        >
          <Input
            type={"email"}
            placeholder="test@gmail.com"
            disabled={isLoading}
            size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
          name={"Password"}
          rules={[
            { required: true, message: 'vui long nhap mật khẩu' },
            { min: 6, message: "mật khẩu có ít nhất 6 ký tự" },
          ]}>
          <Input
            type={'password'}
            size="large"
            disabled={isLoading} />
        </Form.Item>
        <Form.Item>
          <AntButton
            type="primary"
            htmlType="submit"
            block
            size="large"
            disabled={isLoading}
            icon={isLoading ? <LoadingOutlined /> : <LoginOutlined />}
          >
            {isLoading ? 'Đang Đăng Nhập' : 'Đăng Nhập'}
          </AntButton>
        </Form.Item>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-black dark:text-blue-100 mb-2">
            🔧 Tài khoản test (Mock mode)
          </p>
          <div className="space-y-2 text-xs text-blue-800 dark:text-blue-200">
            <div className="text-black">
              <strong className="text-black">Admin:</strong> admin@cnc.com / admin123
            </div>
            <div className="text-black">
              <strong>Operator:</strong> operator@cnc.com / operator123
            </div >
            <div className="text-black">
              <strong>Viewer:</strong> viewer@cnc.com / viewer123
            </div>
          </div>
        </div>

      </Form>
    </AntCard>
  );
}
