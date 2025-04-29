import { 
  BaseWalletAdapter, 
  WalletAccount, 
  WalletTransaction, 
  WalletBalance,
  WalletEvent,
  WalletConnectionStatus
} from './base-adapter';

/**
 * Mysten Dapp Kit钱包适配器
 * 将@mysten/dapp-kit包装为统一的接口
 */
export class MystenAdapter implements BaseWalletAdapter {
  private wallet: any = null; // mysten钱包实例
  private walletContext: any = null; // 钱包上下文
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    this.eventListeners = new Map();
    Object.values(WalletEvent).forEach(event => {
      this.eventListeners.set(event, new Set());
    });
  }

  // 初始化wallet实例和上下文
  init(wallet: any, context?: any): void {
    this.wallet = wallet;
    this.walletContext = context;
  }

  // 基本信息
  get name(): string {
    return this.wallet?.name || 'Sui Wallet';
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
    if (!this.wallet?.currentAccount) return null;
    
    return {
      address: this.wallet.currentAccount.address,
      publicKey: this.wallet.currentAccount.publicKey?.toString(),
    };
  }

  // 连接管理
  async connect(): Promise<WalletAccount | null> {
    if (!this.wallet) throw new Error('Wallet not initialized');
    
    try {
      // Mysten的连接方式
      await this.wallet.connect();
      
      if (this.wallet.connected && this.wallet.currentAccount) {
        const account: WalletAccount = {
          address: this.wallet.currentAccount.address,
          publicKey: this.wallet.currentAccount.publicKey?.toString(),
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
      await this.wallet.disconnect();
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
    
    if (!this.walletContext?.signAndExecuteTransactionBlock) {
      throw new Error('signAndExecute not available');
    }
    
    try {
      return await this.walletContext.signAndExecuteTransactionBlock({
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
    if (!this.wallet || !this.wallet.currentAccount) {
      return null;
    }
    
    try {
      // 注意: Mysten SDK可能没有直接提供余额，这里可能需要
      // 通过RPC调用来获取
      const balanceAmount = BigInt(0); // 默认值
      
      return {
        amount: balanceAmount,
        decimals: 9, // SUI默认9位小数
        symbol: 'SUI'
      };
    } catch (error) {
      console.error('获取余额失败:', error);
      return null;
    }
  }

  getAddress(): string | null {
    return this.wallet?.currentAccount?.address || null;
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