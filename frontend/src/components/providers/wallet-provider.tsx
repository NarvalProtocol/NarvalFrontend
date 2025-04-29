'use client';

import * as React from 'react';
import { WalletProvider as SuietWalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

type WalletProviderProps = {
  children: React.ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  return <SuietWalletProvider>{children}</SuietWalletProvider>;
}
