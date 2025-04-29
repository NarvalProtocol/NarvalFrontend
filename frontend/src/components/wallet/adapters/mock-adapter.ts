import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { 
  BaseWalletAdapter, 
  WalletAdapterConfig, 
  WalletAccount, 
  WalletBalance, 
  WalletConnectionStatus, 
  WalletEvent, 
  WalletTransaction 
} from './base-adapter';

/**
 * Mock Wallet Adapter Configuration
 */
export interface MockWalletAdapterConfig extends WalletAdapterConfig {
  autoConnect?: boolean; // Whether to connect automatically
  connectDelay?: number; // Connection delay (milliseconds)
  mockAddress?: string; // Mock wallet address
}

/**
 * Mock Wallet Adapter
 * Used in development and testing environments to simulate real wallet behavior
 */
export class MockWalletAdapter extends EventEmitter implements BaseWalletAdapter {
  private _connectionStatus: WalletConnectionStatus = WalletConnectionStatus.DISCONNECTED;
  private _address: string | null = null;
  private _config: MockWalletAdapterConfig;
  private _mockBalances: Map<string, WalletBalance> = new Map();

  /**
   * Get wallet name
   */
  get name(): string {
    return this._config.name;
  }

  /**
   * Get wallet icon
   */
  get icon(): string | undefined {
    return this._config.icon;
  }

  /**
   * Get current connection status
   */
  get connectionStatus(): WalletConnectionStatus {
    return this._connectionStatus;
  }

  /**
   * Get current wallet address
   */
  get address(): string | null {
    return this._address;
  }

  /**
   * Constructor
   * @param config Mock wallet configuration
   */
  constructor(config: MockWalletAdapterConfig) {
    super();
    this._config = config;

    // Set default mock balances
    this._mockBalances.set('ETH', {
      token: 'ETH',
      amount: '1.5',
      decimals: 18
    });
    
    this._mockBalances.set('USDT', {
      token: 'USDT',
      amount: '100',
      decimals: 6
    });

    // If auto-connect is configured, connect wallet automatically
    if (config.autoConnect) {
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Auto connect failed:', error);
        });
      }, config.connectDelay || 100);
    }
  }

  /**
   * Connect wallet
   * @returns Wallet address
   */
  async connect(): Promise<string> {
    if (this._connectionStatus === WalletConnectionStatus.CONNECTED) {
      return this._address!;
    }

    this._connectionStatus = WalletConnectionStatus.CONNECTING;
    this.emit(WalletEvent.STATUS_CHANGE, this._connectionStatus);

    try {
      // Simulate connection delay
      const delay = this._config.connectDelay || 500;
      await new Promise(resolve => setTimeout(resolve, delay));

      // Set address
      this._address = this._config.mockAddress || this._generateMockAddress();
      this._connectionStatus = WalletConnectionStatus.CONNECTED;
      
      // Trigger connection event
      this.emit(WalletEvent.STATUS_CHANGE, this._connectionStatus);
      this.emit(WalletEvent.CONNECT, this._address);
      
      return this._address;
    } catch (error) {
      this._connectionStatus = WalletConnectionStatus.ERROR;
      this.emit(WalletEvent.STATUS_CHANGE, this._connectionStatus);
      this.emit(WalletEvent.ERROR, error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    if (this._connectionStatus === WalletConnectionStatus.DISCONNECTED) {
      return;
    }

    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 300));

    this._address = null;
    this._connectionStatus = WalletConnectionStatus.DISCONNECTED;
    
    // Trigger disconnect event
    this.emit(WalletEvent.STATUS_CHANGE, this._connectionStatus);
    this.emit(WalletEvent.DISCONNECT);
  }

  /**
   * Get account list
   * @returns Account list
   */
  async getAccounts(): Promise<WalletAccount[]> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Return mock accounts
    return [
      {
        address: this._address!,
        isDefault: true,
        label: 'Mock Account'
      }
    ];
  }

  /**
   * Get token balance
   * @param tokenOrSymbol Token symbol or address, defaults to ETH
   * @returns Token balance
   */
  async getBalance(tokenOrSymbol: string = 'ETH'): Promise<WalletBalance | null> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Return mock balance
    return this._mockBalances.get(tokenOrSymbol) || null;
  }

  /**
   * Get all token balances
   * @returns List of all token balances
   */
  async getAllBalances(): Promise<WalletBalance[]> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Return all mock balances
    return Array.from(this._mockBalances.values());
  }

  /**
   * Send transaction
   * @param transaction Transaction data
   * @returns Transaction hash
   */
  async sendTransaction(transaction: any): Promise<string> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    console.log('Mock sending transaction:', transaction);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock transaction hash
    return `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  /**
   * Sign message
   * @param message Message content
   * @returns Signature result
   */
  async signMessage(message: string): Promise<string> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    console.log('Mock signing message:', message);

    // Simulate signing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock signature
    return `0x${Array.from({length: 130}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
  }

  /**
   * Sign and execute transaction
   * @param transaction Transaction data
   * @returns Transaction result
   */
  async signAndExecuteTransactionBlock(transaction: WalletTransaction): Promise<any> {
    if (this._connectionStatus !== WalletConnectionStatus.CONNECTED) {
      throw new Error('Wallet not connected');
    }

    console.log('Mock sign and execute transaction:', transaction);

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return mock transaction result
    return {
      digest: `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`,
      effects: {},
      events: [],
      timestamp_ms: Date.now(),
      checkpoint: Math.floor(Math.random() * 1000000)
    };
  }

  /**
   * Set mock balance
   * @param token Token symbol or address
   * @param amount Balance amount
   * @param decimals Decimal places
   */
  setMockBalance(token: string, amount: string, decimals: number): void {
    this._mockBalances.set(token, {
      token,
      amount,
      decimals
    });
  }

  /**
   * Generate mock wallet address
   * @returns Mock wallet address
   */
  private _generateMockAddress(): string {
    return `0x${uuidv4().replace(/-/g, '').substring(0, 40)}`;
  }
} 