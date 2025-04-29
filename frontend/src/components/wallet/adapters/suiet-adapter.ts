import { useWallet } from '@suiet/wallet-kit';
import { 
  BaseWalletAdapter, 
  WalletAccount, 
  WalletTransaction, 
  WalletBalance,
  WalletEvent,
  WalletConnectionStatus
} from './base-adapter';

/**
 * Suiet钱包适配器
 * 将@suiet/wallet-kit包装为统一的接口
 */
export class SuietAdapter implements BaseWalletAdapter {
  private wallet: ReturnType<typeof useWallet> | null = null;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.eventListeners = new Map();
    Object.values(WalletEvent).forEach(event => {
      this.eventListeners.set(event, new Set());
    });
  }

  // 初始化wallet实例
  init(wallet: ReturnType<typeof useWallet>): void {
    this.wallet = wallet;
  }

  // 基本信息
  get name(): string {
    return this.wallet?.name || 'Suiet';
  }

  get isConnected(): boolean {
    return !!this.wallet?.connected;
  }

  get isConnecting(): boolean {
    return !!this.wallet?.connecting;
  }

  get chainId(): string | undefined {
    return this.wallet?.chain?.id;
  }

  get network(): string | undefined {
    return this.wallet?.chain?.name;
  }

  get account(): WalletAccount | null {
    if (!this.wallet?.account) return null;
    
    return {
      address: this.wallet.account.address,
      publicKey: this.wallet.account.publicKey?.toString(),
    };
  }

  // 连接管理
  async connect(): Promise<WalletAccount | null> {
    if (!this.wallet) throw new Error('Wallet not initialized');
    
    try {
      await this.wallet.select();
      
      if (this.wallet.connected && this.wallet.account) {
        const account: WalletAccount = {
          address: this.wallet.account.address,
          publicKey: this.wallet.account.publicKey?.toString(),
        };
        
        this.triggerEvent(WalletEvent.CONNECT, account);
        return account;
      }
      
      return null;
    } catch (error) {
      this.triggerEvent(WalletEvent.ERROR, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.wallet) return;
    
    try {
      this.wallet.disconnect();
      this.triggerEvent(WalletEvent.DISCONNECT, null);
    } catch (error) {
      this.triggerEvent(WalletEvent.ERROR, error);
      throw error;
    }
  }

  // 交易相关
  async signAndExecuteTransaction(transaction: WalletTransaction): Promise<any> {
    if (!this.wallet || !this.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      return await this.wallet.signAndExecuteTransactionBlock({
        transactionBlock: transaction.transactionBlock,
        ...transaction.options
      });
    } catch (error) {
      this.triggerEvent(WalletEvent.ERROR, error);
      throw error;
    }
  }

  // 账户信息
  async getBalance(): Promise<WalletBalance | null> {
    if (!this.wallet || !this.isConnected || !this.wallet.account) {
      return null;
    }
    
    try {
      // 获取余额 - 如果wallet.balance存在
      const balanceValue = this.wallet.balance ? BigInt(this.wallet.balance) : BigInt(0);
      
      return {
        amount: balanceValue,
        decimals: 9, // SUI默认9位小数
        symbol: 'SUI'
      };
    } catch (error) {
      console.error('获取余额失败:', error);
      return null;
    }
  }

  getAddress(): string | null {
    return this.wallet?.account?.address || null;
  }

  // 事件管理
  on(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private triggerEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }
} 