// Note: Make sure to install required packages:
// npm install @suiet/wallet-kit @mysten/sui.js @mysten/wallet-standard

import { createAppError, ErrorType, handleError } from '@/utils/error-handlers';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { blockchainClient } from './blockchain-client';

/**
 * 钱包连接状态
 */
export enum WalletConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

/**
 * 钱包账户信息
 */
export interface WalletAccount {
  address: string;
  publicKey: string;
  label?: string;
  iconUrl?: string;
}

/**
 * 钱包交互和管理服务
 */
export class WalletService {
  private walletInstance: any | null = null;
  private client: SuiClient;

  constructor() {
    this.client = blockchainClient.getSuiClient();
  }

  /**
   * 初始化钱包连接
   */
  public initWallet(walletProvider: any): void {
    this.walletInstance = walletProvider;
  }

  /**
   * 检查钱包是否正确初始化
   */
  public isInitialized(): boolean {
    return !!this.walletInstance;
  }

  /**
   * 获取钱包连接状态
   */
  public getStatus(): WalletConnectionStatus {
    if (!this.walletInstance) {
      return WalletConnectionStatus.DISCONNECTED;
    }

    try {
      const isConnected = this.walletInstance.isConnected();
      return isConnected ? WalletConnectionStatus.CONNECTED : WalletConnectionStatus.DISCONNECTED;
    } catch (error) {
      console.error('检查钱包连接状态出错:', error);
      return WalletConnectionStatus.ERROR;
    }
  }

  /**
   * 连接钱包
   */
  public async connect(): Promise<WalletAccount> {
    try {
      if (!this.walletInstance) {
        throw createAppError('钱包提供程序未初始化', ErrorType.WALLET);
      }

      const accounts = await this.walletInstance.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw createAppError('钱包中未找到账户', ErrorType.WALLET);
      }

      const account = accounts[0];
      return {
        address: account.address,
        publicKey: account.publicKey?.toString() || '',
        label: account.label,
        iconUrl: account.iconUrl,
      };
    } catch (error) {
      throw handleError(error, {
        context: 'WalletService.connect',
        fallbackMessage: '连接钱包失败',
      });
    }
  }

  /**
   * 断开钱包连接
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.walletInstance && this.walletInstance.disconnect) {
        await this.walletInstance.disconnect();
      }
    } catch (error) {
      throw handleError(error, {
        context: 'WalletService.disconnect',
        fallbackMessage: '断开钱包连接失败',
      });
    }
  }

  /**
   * 获取钱包账户
   */
  public async getAccount(): Promise<WalletAccount | null> {
    try {
      if (!this.walletInstance || !this.walletInstance.isConnected()) {
        return null;
      }

      const accounts = await this.walletInstance.getAccounts();
      if (!accounts || accounts.length === 0) {
        return null;
      }

      const account = accounts[0];
      return {
        address: account.address,
        publicKey: account.publicKey?.toString() || '',
        label: account.label,
        iconUrl: account.iconUrl,
      };
    } catch (error) {
      console.error('获取钱包账户出错:', error);
      return null;
    }
  }

  /**
   * 获取钱包余额
   */
  public async getBalance(address?: string): Promise<bigint> {
    try {
      const account = await this.getAccount();
      if (!account && !address) {
        throw createAppError('未连接钱包且未提供地址', ErrorType.WALLET);
      }

      const targetAddress = address || account!.address;
      return await blockchainClient.getBalance(targetAddress);
    } catch (error) {
      throw handleError(error, {
        context: 'WalletService.getBalance',
        fallbackMessage: '获取钱包余额失败',
      });
    }
  }

  /**
   * 执行交易
   */
  public async executeTransaction(
    transactionBlock: TransactionBlock,
    options?: {
      requestType?: 'WaitForLocalExecution' | 'WaitForEffectsCert';
    }
  ) {
    try {
      if (!this.walletInstance || !this.walletInstance.isConnected()) {
        throw createAppError('钱包未连接', ErrorType.WALLET);
      }

      // 从钱包实例获取签名者
      const signer = this.walletInstance.getAccounts()[0];
      if (!signer) {
        throw createAppError('钱包中没有可用账户', ErrorType.WALLET);
      }

      // 执行交易
      return await blockchainClient.executeTransaction(
        transactionBlock,
        this.walletInstance,
        options
      );
    } catch (error) {
      throw handleError(error, {
        context: 'WalletService.executeTransaction',
        fallbackMessage: '执行交易失败',
      });
    }
  }
}

// 导出默认实例
const walletService = new WalletService();
export { walletService };
