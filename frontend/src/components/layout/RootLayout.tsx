'use client';

import { ReactNode } from 'react';
import { MainLayout } from './main-layout';

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
