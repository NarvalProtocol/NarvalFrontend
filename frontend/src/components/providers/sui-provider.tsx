'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

// 定义支持的网络
export const NETWORKS = {
  mainnet: { url: getFullnodeUrl('mainnet'), name: 'Mainnet' },
  testnet: { url: getFullnodeUrl('testnet'), name: 'Testnet' },
  devnet: { url: getFullnodeUrl('devnet'), name: 'Devnet' },
  localnet: { url: 'http://127.0.0.1:9000', name: 'Localnet' },
};

// 默认使用的网络
const DEFAULT_NETWORK = 'testnet';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 30 * 1000, // 30 秒
    },
  },
});

export interface SuiProviderProps {
  children: React.ReactNode;
  defaultNetwork?: keyof typeof NETWORKS;
}

export function SuiProvider({ children, defaultNetwork = DEFAULT_NETWORK }: SuiProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={NETWORKS}
        defaultNetwork={defaultNetwork}
        createClient={(network, config) => new SuiClient({ url: config.url })}
      >
        <WalletProvider autoConnect={false}>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
