import { useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useWalletStore } from '@/store/wallet-store';
import { useWalletBalance, useWalletAssets } from '@/hooks/use-wallet-query';
import { showNotification } from '@/store/notification-store';

// 整合钱包连接状态与 Zustand 存储
export function useWalletIntegration() {
  const wallet = useWallet();
  const { connected, connecting, select, disconnect: disconnectWallet, chain, account } = wallet;
  const { setConnected, setWalletInfo, disconnect } = useWalletStore();
  
  // 获取钱包余额
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance();
  
  // 获取钱包资产
  const { data: assetsData, isLoading: isAssetsLoading } = useWalletAssets();
  
  // 当钱包连接状态改变时，更新 Zustand 存储
  useEffect(() => {
    if (connected && account?.address) {
      setWalletInfo(
        account.address, 
        wallet.name || '未知钱包'
      );
    } else {
      disconnect();
    }
  }, [connected, account, wallet, setWalletInfo, disconnect]);
  
  // 连接钱包
  const handleConnect = async () => {
    try {
      if (connecting) return;
      await select();
      showNotification.success('钱包连接', '钱包已成功连接');
    } catch (error) {
      console.error('连接错误:', error);
      showNotification.error('连接失败', '钱包连接失败，请重试');
    }
  };
  
  // 断开连接
  const handleDisconnect = () => {
    try {
      disconnectWallet();
      disconnect();
      showNotification.info('钱包断开连接', '钱包已断开连接');
    } catch (error) {
      console.error('断开连接错误:', error);
      showNotification.error('断开连接失败', '钱包断开连接失败，请重试');
    }
  };
  
  return {
    isConnected: connected,
    isConnecting: connecting,
    account,
    wallet,
    chain,
    balance: balanceData,
    assets: assetsData,
    isBalanceLoading,
    isAssetsLoading,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
} 