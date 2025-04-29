import { QueryClient } from '@tanstack/react-query';

// 创建全局 QueryClient 实例，配置区块链数据的最佳实践
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      // 区块链数据通常不会在后台改变，可以降低自动重新获取频率
      refetchOnWindowFocus: false,
      // 区块链 RPC 可能不稳定，增加重试次数
      retry: 3,
      // 保持数据新鲜的时间
      staleTime: 30 * 1000, // 30 秒
      // 数据在缓存中的保留时间
      gcTime: 5 * 60 * 1000, // 5 分钟
    },
  },
});

// 创建自定义查询键工厂
export const queryKeys = {
  wallet: {
    all: ['wallet'] as const,
    account: () => [...queryKeys.wallet.all, 'account'] as const,
    balance: (address: string) => [...queryKeys.wallet.all, 'balance', address] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    byAddress: (address: string) => [...queryKeys.transactions.all, 'address', address] as const,
    byId: (id: string) => [...queryKeys.transactions.all, 'id', id] as const,
  },
  assets: {
    all: ['assets'] as const,
    byAddress: (address: string) => [...queryKeys.assets.all, 'address', address] as const,
    byType: (type: string) => [...queryKeys.assets.all, 'type', type] as const,
  },
  lending: {
    all: ['lending'] as const,
    markets: () => [...queryKeys.lending.all, 'markets'] as const,
    positions: (address: string) => [...queryKeys.lending.all, 'positions', address] as const,
  },
  // 添加更多领域特定的查询键
}; 