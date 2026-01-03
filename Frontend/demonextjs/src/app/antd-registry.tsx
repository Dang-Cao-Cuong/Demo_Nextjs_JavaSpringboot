'use client';

import { AntdRegistry as NextAntdRegistry } from '@ant-design/nextjs-registry';
import { ReactNode } from 'react';

export default function AntdRegistry({ children }: { children: ReactNode }) {
  return <NextAntdRegistry>{children}</NextAntdRegistry>;
}
