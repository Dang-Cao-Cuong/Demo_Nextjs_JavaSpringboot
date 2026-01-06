'use client';

import { I18nextProvider as Provider } from 'react-i18next';
import i18n from '@/i18n/config';

export function I18nextProvider({ children }: { children: React.ReactNode }) {
  return <Provider i18n={i18n}>{children}</Provider>;
}