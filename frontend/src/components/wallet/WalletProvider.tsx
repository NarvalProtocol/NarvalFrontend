import { WalletProvider as SuietWalletProvider } from '@suiet/wallet-kit';
import { ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <SuietWalletProvider>
      {children}
    </SuietWalletProvider>
  );
} 