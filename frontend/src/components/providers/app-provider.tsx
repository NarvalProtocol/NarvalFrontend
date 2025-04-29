'use client';

import * as React from 'react';
import { ThemeProvider } from './theme-provider';
import { WalletProvider } from './wallet-provider';
import { SuiProvider } from './sui-provider';

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <SuiProvider defaultNetwork="testnet">{children}</SuiProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}
