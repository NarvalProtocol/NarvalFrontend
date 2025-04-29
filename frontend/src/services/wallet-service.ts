import { EventEmitter } from 'events';
import { BaseWalletAdapter, WalletEvent, WalletConnectionStatus } from '@/components/wallet/adapters/base-adapter';
import { retryOperation } from '@/utils/error-handlers';

// Error types
export enum WalletServiceErrorType {
  NO_ADAPTER = 'NO_ADAPTER',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  OPERATION_ERROR = 'OPERATION_ERROR',
}

// Error class
export class WalletServiceError extends Error {
  type: WalletServiceErrorType;

  constructor(type: WalletServiceErrorType, message: string) {
    super(message);
    this.type = type;
    this.name = 'WalletServiceError';
  }
}

// Export wallet event types
export enum WalletEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ACCOUNT_CHANGE = 'accountChange',
  ERROR = 'error',
  ADAPTER_CHANGE = 'adapterChange'
}

/**
 * Wallet service class that manages wallet adapters and provides a unified interface
 */
class WalletServiceImpl extends EventEmitter {
  private _adapter: BaseWalletAdapter | null = null;
  private _address: string | null = null;
  private _redirectUrl: string | null = null;

  constructor() {
    super();
    this.setMaxListeners(50); // Increase maximum number of listeners to avoid warnings
  }

  /**
   * Initialize wallet adapter
   * @param adapter Wallet adapter instance
   */
  initAdapter(adapter: BaseWalletAdapter): void {
    // If there's an existing adapter, remove its listeners first
    if (this._adapter) {
      this.removeAdapterListeners(this._adapter);
    }

    this._adapter = adapter;
    this._address = null;
    
    // Add event listeners
    this.setupAdapterListeners(adapter);
    
    // Trigger adapter change event
    this.emit('adapterChange', adapter);
  }

  /**
   * Set up event listeners for the adapter
   */
  private setupAdapterListeners(adapter: BaseWalletAdapter): void {
    // Listen for wallet connection events
    adapter.on(WalletEvent.CONNECT, this.handleConnect.bind(this));
    // Listen for wallet disconnection events
    adapter.on(WalletEvent.DISCONNECT, this.handleDisconnect.bind(this));
    // Listen for wallet account change events
    adapter.on(WalletEvent.ACCOUNT_CHANGE, this.handleAccountChange.bind(this));
    // Listen for wallet error events
    adapter.on(WalletEvent.ERROR, this.handleError.bind(this));
  }

  /**
   * Remove adapter event listeners
   */
  private removeAdapterListeners(adapter: BaseWalletAdapter): void {
    adapter.removeAllListeners();
  }

  /**
   * Handle wallet connection event
   */
  private handleConnect(): void {
    if (!this._adapter) return;
    
    this._address = this._adapter.address;
    this.emit('connect', this._address);
  }

  /**
   * Handle wallet disconnection event
   */
  private handleDisconnect(): void {
    this._address = null;
    this.emit('disconnect');
  }

  /**
   * Handle wallet account change event
   */
  private handleAccountChange(address: string): void {
    this._address = address;
    this.emit('accountChange', address);
  }

  /**
   * Handle wallet error event
   */
  private handleError(error: Error): void {
    this.emit('error', error);
  }

  /**
   * Trigger connection event
   */
  dispatchConnectEvent(address: string): void {
    this._address = address;
    this.emit(WalletEvents.CONNECT, address);
  }

  /**
   * Trigger disconnection event
   */
  dispatchDisconnectEvent(): void {
    this._address = null;
    this.emit(WalletEvents.DISCONNECT);
  }

  /**
   * Trigger error event
   */
  dispatchErrorEvent(error: any): void {
    this.emit(WalletEvents.ERROR, error);
  }

  /**
   * Set redirect URL
   */
  setRedirectUrl(url: string): void {
    this._redirectUrl = url;
  }

  /**
   * Get redirect URL
   */
  getRedirectUrl(): string | null {
    return this._redirectUrl;
  }

  /**
   * Clear redirect URL
   */
  clearRedirectUrl(): void {
    this._redirectUrl = null;
  }

  /**
   * Add event listener
   */
  addEventListener(event: string, listener: (...args: any[]) => void): void {
    this.on(event, listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(event: string, listener: (...args: any[]) => void): void {
    this.off(event, listener);
  }

  /**
   * Connect wallet
   */
  async connect(): Promise<string | null> {
    if (!this._adapter) {
      throw new WalletServiceError(
        WalletServiceErrorType.NO_ADAPTER,
        'No wallet adapter set'
      );
    }

    try {
      // Use retry mechanism to connect wallet
      await retryOperation(
        () => this._adapter!.connect(),
        {
          retries: 3,
          interval: 500,
          shouldRetry: (error) => {
            // Decide whether to retry based on error type
            return !(error instanceof WalletServiceError);
          }
        }
      );
      
      return this._address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new WalletServiceError(
        WalletServiceErrorType.CONNECTION_ERROR,
        `Failed to connect wallet: ${message}`
      );
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    if (!this._adapter) {
      throw new WalletServiceError(
        WalletServiceErrorType.NO_ADAPTER,
        'No wallet adapter set'
      );
    }

    try {
      await this._adapter.disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new WalletServiceError(
        WalletServiceErrorType.OPERATION_ERROR,
        `Failed to disconnect wallet: ${message}`
      );
    }
  }

  /**
   * Get connection status
   */
  get connectionStatus(): WalletConnectionStatus {
    return this._adapter ? this._adapter.connectionStatus : WalletConnectionStatus.DISCONNECTED;
  }

  /**
   * Get current connected wallet address
   */
  get address(): string | null {
    return this._address;
  }

  /**
   * Get current adapter
   */
  get adapter(): BaseWalletAdapter | null {
    return this._adapter;
  }

  /**
   * Check if wallet is connected
   */
  get isConnected(): boolean {
    return this.connectionStatus === WalletConnectionStatus.CONNECTED;
  }

  /**
   * Check if wallet is connecting
   */
  get isConnecting(): boolean {
    return this.connectionStatus === WalletConnectionStatus.CONNECTING;
  }
}

// Export singleton instance
export const WalletService = new WalletServiceImpl(); 