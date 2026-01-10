'use client';

import React, { useState } from 'react';
import { Button, Drawer, Divider, Space, theme, ColorPicker, Switch, Segmented, Row, Col } from 'antd';
import { SettingOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { useThemeStore } from '@/stores/themeStore';
import { THEME_PRESETS } from '@/configs/themeConfig';

const { useToken } = theme;

const ThemeCustomizer = () => {
    const [open, setOpen] = useState(false);
    const { token } = useToken();
    const { theme, setTheme } = useTheme();
    const {
        colorPrimary,
        borderRadius,
        compactMode,
        setColorPrimary,
        setBorderRadius,
        setCompactMode,
        resetTheme,
    } = useThemeStore();

    const handleReset = () => {
        resetTheme();
        setTheme('system');
    };

    return (
        <>
            <Button
                type="primary"
                icon={<SettingOutlined />}
                size="large"
                style={{
                    position: 'fixed',
                    right: 24,
                    bottom: 24,
                    zIndex: 9999,
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
                onClick={() => setOpen(true)}
            />

            <Drawer
                title="Theme Customizer"
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                styles={{ wrapper: { width: 320 } }}
                extra={
                    <Button icon={<ReloadOutlined />} onClick={handleReset} size="small">
                        Reset
                    </Button>
                }
            >
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Mode */}
                    <div>
                        <h4 style={{ marginBottom: 12 }}>Mode</h4>
                        <Segmented
                            block
                            value={theme}
                            options={[
                                { label: 'Light', value: 'light' },
                                { label: 'Dark', value: 'dark' },
                                { label: 'System', value: 'system' },
                            ]}
                            onChange={(val) => setTheme(val)}
                        />
                    </div>

                    <Divider style={{ margin: '0' }} />

                    {/* Primary Color */}
                    <div>
                        <h4 style={{ marginBottom: 12 }}>Primary Color</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                            {THEME_PRESETS.colors.map((color) => (
                                <div
                                    key={color.name}
                                    onClick={() => setColorPrimary(color.value)}
                                    style={{
                                        backgroundColor: color.value,
                                        height: 36,
                                        borderRadius: token.borderRadius,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: colorPrimary === color.value ? `2px solid ${token.colorText}` : 'none',
                                    }}
                                    title={color.name}
                                >
                                    {colorPrimary === color.value && <CheckOutlined style={{ color: '#fff' }} />}
                                </div>
                            ))}
                        </div>
                        <ColorPicker
                            showText
                            value={colorPrimary}
                            onChange={(acc) => setColorPrimary(acc.toHexString())}
                        />
                    </div>

                    <Divider style={{ margin: '0' }} />

                    {/* Border Radius */}
                    <div>
                        <h4 style={{ marginBottom: 12 }}>Border Radius</h4>
                        <Segmented
                            block
                            value={borderRadius}
                            options={THEME_PRESETS.borderRadius.map((r) => ({
                                label: r.name,
                                value: r.value,
                            }))}
                            onChange={(val) => setBorderRadius(Number(val))}
                        />
                    </div>

                    <Divider style={{ margin: '0' }} />

                    {/* Compact Mode */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Compact Mode</h4>
                        <Switch checked={compactMode} onChange={setCompactMode} />
                    </div>
                </Space>
            </Drawer>
        </>
    );
};

export default ThemeCustomizer;
