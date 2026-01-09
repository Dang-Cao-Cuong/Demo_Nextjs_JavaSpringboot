import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập | Quản lý máy CNC',
  description: 'Đăng nhập vào hệ thống quản lý máy CNC',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <LoginForm />
    </div>
  );
}