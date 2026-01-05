'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Spin, Button, Space } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/auth-context';

// BIẾN TẠM THỜI CHO DEVELOPMENT: Đặt true để bỏ qua authentication
const SKIP_AUTH_IN_DEV = false; // Đổi thành true để tắt authentication trong development

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, logout, user } = useAuth();

  useEffect(() => {
    // Bỏ qua authentication nếu SKIP_AUTH_IN_DEV = true
    if (SKIP_AUTH_IN_DEV) return;
    
    // Đợi loading xong mới kiểm tra authentication
    if (!loading && !isAuthenticated) {
      // Lưu trang hiện tại để redirect lại sau khi đăng nhập
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Hiển thị loading khi đang kiểm tra authentication (trừ khi skip auth)
  if (!SKIP_AUTH_IN_DEV && loading) {
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

  // Không hiển thị nội dung nếu chưa đăng nhập (trừ khi skip auth)
  if (!SKIP_AUTH_IN_DEV && !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
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
            Hệ thống Quản lý Máy CNC
          </h2>
        </div>
        
        <Space size="middle">
          {user && (
            <span style={{ color: '#666', fontSize: '14px' }}>
              <UserOutlined style={{ marginRight: '6px' }} />
              {user.fullname || user.username}
            </span>
          )}
          {!SKIP_AUTH_IN_DEV && (
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          )}
        </Space>
      </div>

      {/* Main Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
