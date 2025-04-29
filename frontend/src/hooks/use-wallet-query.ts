import { useQuery } from '@tanstack/react-query';
import { SuiClient } from '@mysten/sui/client';
import { useWallet } from '@suiet/wallet-kit';
import { queryKeys } from '@/lib/query-client';
import { AssetSchema, TransactionSchema } from '@/types/schemas';
import { z } from 'zod';

// 获取钱包余额的钩子
export function useWalletBalance() {
  const { account, chain, connected } = useWallet();
  const client = new SuiClient({ url: chain?.rpcUrl || '' });

  return useQuery({
    queryKey: queryKeys.wallet.balance(account?.address || ''),
    queryFn: async () => {
      if (!account?.address) {
        throw new Error('钱包未连接');
      }
      
      const response = await client.getBalance({
        owner: account.address,
      });
      
      // 将响应数据转换为标准格式
      return {
        totalBalance: response.totalBalance,
        coinType: response.coinType,
        // 转换为易读格式
        formatted: (Number(response.totalBalance) / 1_000_000_000).toFixed(4),
      };
    },
    // 只有连接了钱包才启用查询
    enabled: connected && !!account?.address && !!chain?.rpcUrl,
    // 区块链余额数据可能会变化，较快更新
    staleTime: 15 * 1000, // 15秒
  });
}

// 获取钱包资产的钩子
export function useWalletAssets() {
  const { account, connected } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.assets.byAddress(account?.address || ''),
    queryFn: async () => {
      if (!account?.address) {
        throw new Error('钱包未连接');
      }
      
      // 在实际应用中，这里应该调用真实的 API
      // 下面是模拟数据，实际项目中需要替换为真实 API 调用
      const mockAssets = [
        {
          id: '1',
          type: '0x2::sui::SUI',
          symbol: 'SUI',
          name: 'Sui',
          decimals: 9,
          balance: '1000000000000', // 1000 SUI
          value: '1200', // $1200
          icon: 'https://assets.coingecko.com/coins/images/26375/large/sui_asset.jpeg',
        },
        {
          id: '2',
          type: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN',
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          balance: '500000000', // 500 USDC
          value: '500', // $500
          icon: 'https://assets.coingecko.com/coins/images/6319/large/usdc.png',
        }
      ];
      
      // 使用 Zod 验证数据
      return z.array(AssetSchema).parse(mockAssets);
    },
    enabled: connected && !!account?.address,
    staleTime: 30 * 1000, // 30秒
  });
}

// 获取钱包交易历史的钩子
export function useWalletTransactions(limit = 10) {
  const { account, connected } = useWallet();
  
  return useQuery({
    queryKey: queryKeys.transactions.byAddress(account?.address || ''),
    queryFn: async () => {
      if (!account?.address) {
        throw new Error('钱包未连接');
      }
      
      // 在实际应用中，这里应该调用真实的 API
      // 下面是模拟数据，实际项目中需要替换为真实 API 调用
      const mockTransactions = [
        {
          id: 'tx1',
          timestamp: Date.now() - 3600000, // 1小时前
          sender: account.address,
          recipient: '0x123456789abcdef',
          amount: '1000000000', // 1 SUI
          status: 'success',
          type: 'transfer',
          module: 'sui',
          function: 'transfer',
          gas: '2000000'
        },
        {
          id: 'tx2',
          timestamp: Date.now() - 7200000, // 2小时前
          sender: '0xfedcba987654321',
          recipient: account.address,
          amount: '5000000000', // 5 SUI
          status: 'success',
          type: 'transfer',
          module: 'sui',
          function: 'transfer',
          gas: '2500000'
        }
      ];
      
      // 使用 Zod 验证数据
      return z.array(TransactionSchema).parse(mockTransactions);
    },
    enabled: connected && !!account?.address,
    staleTime: 60 * 1000, // 1分钟
  });
} 