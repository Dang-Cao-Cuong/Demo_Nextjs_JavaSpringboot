'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin, Button, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/auth-context';
import { WebSocketProvider } from '@/providers/WebSocketProvider';
import { MachineErrorListener } from '@/components/machines/MachineErrorListener';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, logout, user } = useAuth();
  const { t } = useTranslation();
  useEffect(() => {
    // Đợi loading xong mới kiểm tra authentication
    if (!loading && !isAuthenticated) {
      // Lưu trang hiện tại để redirect lại sau khi đăng nhập
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Không hiển thị nội dung nếu chưa đăng nhập
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <WebSocketProvider>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
      >

        {/* Listener cho lỗi máy */}
        <MachineErrorListener />

        {/* Header with Logout Button */}
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8e8e8',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1890ff' }}>
              {t('app.description')}
            </h2>
          </div>

          <Space size="middle">
            <LanguageSwitcher />
            {user && (
              <span style={{ color: '#666', fontSize: '14px' }}>
                <UserOutlined style={{ marginRight: '6px' }} />
                {user.fullname || user.username}
              </span>
            )}

            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              {t('auth.logout')}
            </Button>
          </Space>
        </div>

        {/* Main Content */}
        <div>
          {children}
        </div>
      </div>
    </WebSocketProvider>
  );
}