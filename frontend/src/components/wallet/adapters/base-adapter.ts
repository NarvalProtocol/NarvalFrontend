/**
 * Wallet Adapter Configuration
 */
export interface WalletAdapterConfig {
  name: string; // Wallet name
  icon?: string; // Wallet icon
}

/**
 * Wallet Account Information
 */
export interface WalletAccount {
  address: string; // Wallet address
  publicKey?: string; // Public key
  isDefault?: boolean; // Whether it's the default account
  label?: string; // Account label
  iconUrl?: string; // Account icon
}

/**
 * Wallet Balance Information
 */
export interface WalletBalance {
  token: string; // Token symbol or address
  amount: string; // Balance amount
  decimals: number; // Decimal places
}

/**
 * Wallet Transaction Type
 */
export interface WalletTransaction {
  transactionBlock: any; // Transaction data
  options?: {
    showEvents?: boolean;
    showEffects?: boolean;
    showInput?: boolean;
    showObjectChanges?: boolean;
  };
}

/**
 * Wallet Event Types
 */
export enum WalletEvent {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ACCOUNT_CHANGE = 'accountChange',
  STATUS_CHANGE = 'statusChange',
  NETWORK_CHANGE = 'networkChange',
  ERROR = 'error'
}

/**
 * Wallet Connection Status
 */
export enum WalletConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

/**
 * Base Wallet Adapter Interface
 * Defines the methods and properties that wallet adapters must implement
 */
export interface BaseWalletAdapter {
  // Basic information
  readonly name: string; // Wallet name
  readonly icon?: string; // Wallet icon
  readonly connectionStatus: WalletConnectionStatus; // Connection status
  readonly address: string | null; // Currently connected wallet address

  // Connection management
  connect(): Promise<string>; // Connect wallet, returns address
  disconnect(): Promise<void>; // Disconnect

  // Account management
  getAccounts(): Promise<WalletAccount[]>; // Get account list

  // Balance queries
  getBalance(tokenOrSymbol?: string): Promise<WalletBalance | null>; // Get specific token balance
  getAllBalances?(): Promise<WalletBalance[]>; // Get all balances

  // Transactions and signatures
  sendTransaction(transaction: any): Promise<string>; // Send transaction
  signMessage?(message: string): Promise<string>; // Sign message
  signAndExecuteTransactionBlock?(transaction: WalletTransaction): Promise<any>; // Sign and execute transaction

  // Event handling
  on(event: string, listener: (...args: any[]) => void): this; // Add event listener
  off(event: string, listener: (...args: any[]) => void): this; // Remove event listener
  removeAllListeners(event?: string): this; // Remove all event listeners
} 