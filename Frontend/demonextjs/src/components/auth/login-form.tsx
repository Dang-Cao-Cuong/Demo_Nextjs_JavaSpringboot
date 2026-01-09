'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Card, Alert, Typography, Divider, App } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/slices/authSlice';
import { LoginRequest } from '@/types';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const { Text } = Typography;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get('returnUrl');
  const { message } = App.useApp();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm<LoginRequest>();

  const dispatch = useAppDispatch();
  // const { login } = useAuth(); // Removed Context usage

  const handleSubmit = async (values: LoginRequest) => {
    setIsLoading(true);
    setError('');

    try {
      await dispatch(login(values)).unwrap();
      message.success(t('auth.loginSuccess'));

      // Redirect về trang trước đó hoặc trang home
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        router.push('/home');
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err.message || t('auth.loginError');
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
          <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('app.description')}</p>
        </div>
      }
      extra={<LanguageSwitcher />}
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
          label={t('auth.username')}
          name="username"
          rules={[
            { required: true, message: t('auth.usernameRequired') },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('auth.username')}
            disabled={isLoading}
            size="large"
          />
        </Form.Item>

        <Form.Item
          label={t('auth.password')}
          name="password"
          rules={[
            { required: true, message: t('auth.passwordRequired') },
            { min: 8, message: t('auth.passwordMinLength') },
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
            {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
          </Button>
        </Form.Item>
      </Form>


    </Card>
  );
}