'use client';

import { toast } from 'react-toastify';
import { useMemo } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { truncateAddress } from '../utils/format';

/**
 * 钱包连接事件
 */
export enum WalletEvents {
  CONNECT = 'wallet_connect',
  DISCONNECT = 'wallet_disconnect',
  ACCOUNT_CHANGE = 'wallet_account_change',
  CHAIN_CHANGE = 'wallet_chain_change',
  ERROR = 'wallet_error',
}

/**
 * 钱包相关错误类型
 */
export enum WalletErrorType {
  CONNECTION_FAILED = '连接失败',
  USER_REJECTED = '用户拒绝',
  WALLET_NOT_INSTALLED = '钱包未安装',
  WALLET_NOT_SUPPORTED = '不支持的钱包',
  UNKNOWN_ERROR = '未知错误',
}

/**
 * 钱包连接状态
 */
export interface WalletStatus {
  connected: boolean;
  connecting: boolean;
  account: any | null;
  walletName: string | null | undefined;
  address: string | null;
  displayAddress: string | null;
  chainId: string | null;
}

/**
 * 使用钱包服务的钩子，提供钱包连接相关的状态和方法
 */
export function useWalletService() {
  const wallet = useWallet();

  // 构建钱包状态
  const walletStatus: WalletStatus = useMemo(() => {
    const address = wallet.account?.address ?? null;
    return {
      connected: wallet.connected,
      connecting: wallet.connecting,
      account: wallet.account,
      walletName: wallet.name,
      address,
      displayAddress: address ? truncateAddress(address) : null,
      chainId: wallet.chain?.id ?? null,
    };
  }, [wallet.connected, wallet.connecting, wallet.account, wallet.name, wallet.chain]);

  /**
   * 连接钱包
   */
  const connectWallet = async () => {
    try {
      if (wallet.connecting) return;
      
      await wallet.select('选择钱包');
      toast.success('钱包连接成功');
      
      // 触发全局事件，通知其他组件
      window.dispatchEvent(
        new CustomEvent(WalletEvents.CONNECT, {
          detail: {
            address: wallet.account?.address,
            walletName: wallet.name,
          },
        })
      );
    } catch (error: any) {
      let errorMessage = WalletErrorType.UNKNOWN_ERROR;
      
      if (error.message?.includes('rejected')) {
        errorMessage = WalletErrorType.USER_REJECTED;
      } else if (error.message?.includes('not installed')) {
        errorMessage = WalletErrorType.WALLET_NOT_INSTALLED;
      } else if (error.message?.includes('failed')) {
        errorMessage = WalletErrorType.CONNECTION_FAILED;
      }
      
      toast.error(`钱包连接失败: ${errorMessage}`);
      
      window.dispatchEvent(
        new CustomEvent(WalletEvents.ERROR, {
          detail: { error: errorMessage },
        })
      );
    }
  };

  /**
   * 断开钱包连接
   */
  const disconnectWallet = () => {
    try {
      wallet.disconnect();
      toast.info('钱包已断开连接');
      
      // 触发全局事件
      window.dispatchEvent(new CustomEvent(WalletEvents.DISCONNECT));
    } catch (error) {
      console.error('断开钱包连接时出错:', error);
    }
  };

  /**
   * 检查钱包连接状态
   */
  const requireWalletConnection = (): boolean => {
    if (!wallet.connected) {
      toast.warning('请先连接钱包');
      return false;
    }
    return true;
  };

  return {
    wallet,
    walletStatus,
    connectWallet,
    disconnectWallet,
    requireWalletConnection,
  };
}

/**
 * 钱包服务类，用于管理全局钱包相关操作
 */
export class WalletService {
  /**
   * 检查钱包连接状态
   * @param address 钱包地址
   * @returns 是否已连接
   */
  static checkWalletConnection(address?: string | null): boolean {
    if (!address) {
      toast.warning('请先连接钱包');
      return false;
    }
    return true;
  }

  /**
   * 添加钱包事件监听器
   * @param event 事件类型
   * @param callback 回调函数
   */
  static addEventListener(
    event: WalletEvents,
    callback: (event: CustomEvent) => void
  ): void {
    window.addEventListener(event, callback as EventListener);
  }

  /**
   * 移除钱包事件监听器
   * @param event 事件类型
   * @param callback 回调函数
   */
  static removeEventListener(
    event: WalletEvents,
    callback: (event: CustomEvent) => void
  ): void {
    window.removeEventListener(event, callback as EventListener);
  }

  /**
   * 获取添加钱包后导航的URL
   * @param fallbackURL 后备URL
   * @returns 导航URL
   */
  static getPostWalletConnectRedirectUrl(fallbackURL: string = '/'): string {
    try {
      // 从会话存储中获取重定向URL
      const redirectUrl = sessionStorage.getItem('wallet_connect_redirect');
      if (redirectUrl) {
        // 使用后清除存储的URL
        sessionStorage.removeItem('wallet_connect_redirect');
        return redirectUrl;
      }
    } catch (error) {
      console.error('获取重定向URL时出错:', error);
    }
    
    return fallbackURL;
  }

  /**
   * 设置连接钱包后的重定向URL
   * @param url 重定向URL
   */
  static setPostWalletConnectRedirectUrl(url: string): void {
    try {
      sessionStorage.setItem('wallet_connect_redirect', url);
    } catch (error) {
      console.error('设置重定向URL时出错:', error);
    }
  }
}

export default WalletService; 