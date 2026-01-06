import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Import translations
import commonVI from '../../public/locales/vi/common.json';
import commonEN from '../../public/locales/en/common.json';

const resources = {
  vi: {
    common: commonVI,
  },
  en: {
    common: commonEN,
  },
};

i18n
  
  .use(initReactI18next) // React integration
  .init({
    resources,
    defaultNS: 'common',
    fallbackLng: 'vi', // Ngôn ngữ mặc định
    supportedLngs: ['vi', 'en'], // Các ngôn ngữ hỗ trợ
    
    interpolation: {
      escapeValue: false, // React đã escape by default
    },

    detection: {
      // Thứ tự ưu tiên detect ngôn ngữ
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Lưu ngôn ngữ đã chọn
      lookupLocalStorage: 'i18nextLng',
    },

    react: {
      useSuspense: false, // Tắt suspense để tránh lỗi SSR
    },
  });

export default i18n;