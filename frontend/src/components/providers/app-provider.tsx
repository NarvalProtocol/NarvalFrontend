'use client';

import * as React from 'react';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from './wallet-provider';
import { SuiProvider } from './sui-provider';
import { NotificationProvider } from '@/context/notification-context';
import { Toaster } from '@/components/ui/toaster';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <SuiProvider defaultNetwork="testnet">
            {children}
            <Toaster />
          </SuiProvider>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
