/**
 * 钱包适配器基础接口
 * 为不同的钱包SDK提供统一的接口
 */

export interface WalletAdapterConfig {
  name: string;
  autoConnect?: boolean;
}

export interface WalletAccount {
  address: string;
  publicKey?: string;
  label?: string;
  iconUrl?: string;
}

export interface WalletTransaction {
  transactionBlock: any;
  options?: any;
}

export interface WalletBalance {
  amount: bigint;
  decimals: number;
  symbol: string;
}

export interface BaseWalletAdapter {
  // 基本信息
  name: string;
  isConnected: boolean;
  isConnecting: boolean;
  chainId?: string;
  network?: string;
  account?: WalletAccount | null;
  
  // 连接管理
  connect(): Promise<WalletAccount | null>;
  disconnect(): Promise<void>;
  
  // 交易相关
  signAndExecuteTransaction(transaction: WalletTransaction): Promise<any>;
  
  // 账户信息
  getBalance(): Promise<WalletBalance | null>;
  getAddress(): string | null;
  
  // 事件
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
}

// 钱包事件类型
export enum WalletEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ACCOUNT_CHANGE = 'accountChange',
  CHAIN_CHANGE = 'chainChange',
  ERROR = 'error'
}

// 钱包连接状态
export enum WalletConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
} 