'use client';

import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    console.log(` Ngôn ngữ đã chuyển sang: ${languageCode}`);
  };

  const items: MenuProps['items'] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <Space>
        <span>{lang.flag}</span>
        <span>{lang.label}</span>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }));

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button icon={<GlobalOutlined />}>
        <Space>
          <span>{currentLanguage?.flag}</span>
          <span>{currentLanguage?.label}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};