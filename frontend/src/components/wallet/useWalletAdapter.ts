import { useState, useEffect } from 'react';
import { useWallet as useSuietWallet } from '@suiet/wallet-kit';
import { WalletService, WalletEvents } from '@/services/wallet-service';
import type { SuiTransactionBlockResponse } from '@mysten/sui/client';

// Wallet transaction interface
export interface WalletTransaction {
  transactionBlock: any; // Using any type to avoid version compatibility issues
  options?: {
    showEvents?: boolean;
    showEffects?: boolean;
    showInput?: boolean;
    showObjectChanges?: boolean;
  };
}

// Custom wallet hook that integrates Suiet Wallet with our service
export function useWalletAdapter() {
  const suietWallet = useSuietWallet();
  const [initialized, setInitialized] = useState(false);

  // Initialize wallet and subscribe to events
  useEffect(() => {
    if (!initialized && suietWallet) {
      // Monitor wallet status changes
      if (suietWallet.connected && suietWallet.account) {
        WalletService.dispatchConnectEvent(suietWallet.account.address);
      }

      // Set as initialized
      setInitialized(true);
    }
  }, [suietWallet, initialized]);

  // Monitor connection status changes
  useEffect(() => {
    if (suietWallet.connected && suietWallet.account) {
      WalletService.dispatchConnectEvent(suietWallet.account.address);
    } else if (!suietWallet.connected && initialized) {
      WalletService.dispatchDisconnectEvent();
    }
  }, [suietWallet.connected, suietWallet.account, initialized]);

  // Integrate Suiet Wallet functionality with our WalletService
  return {
    // Original Suiet wallet state
    ...suietWallet,
    
    // Helper methods
    // Connect wallet and handle redirection
    connect: async () => {
      try {
        console.log('Starting wallet connection');
        // Get redirect URL
        const redirectUrl = WalletService.getRedirectUrl();
        console.log('Current redirect URL:', redirectUrl);
        
        // Handle different versions of wallet interface
        if (typeof suietWallet.select === 'function') {
          console.log('Using select method to connect wallet');
          // @ts-ignore - Parameters may differ between versions
          await suietWallet.select();
        } else {
          console.log('Using connect method to connect wallet');
          // Use standard method
          // @ts-ignore - Handle type compatibility issues
          await suietWallet.connect?.();
        }
        
        console.log('Wallet connection attempt completed, current connection status:', suietWallet.connected);
        
        // Check redirect URL
        if (redirectUrl) {
          console.log('Detected redirect URL, preparing to redirect to:', redirectUrl);
          
          // If connected, redirect immediately
          if (suietWallet.connected) {
            console.log('Wallet connected, redirecting now');
            WalletService.clearRedirectUrl();
            window.location.href = redirectUrl;
          } else {
            // If not connected but connection request is sent, wait briefly and check again
            console.log('Wallet connecting, waiting for status update...');
            setTimeout(() => {
              console.log('Delayed connection status check:', suietWallet.connected);
              if (suietWallet.connected) {
                console.log('Delayed check shows wallet connected, executing redirect');
                WalletService.clearRedirectUrl();
                window.location.href = redirectUrl;
              } else {
                console.log('Wallet still not connected after delayed check');
              }
            }, 500); // Wait 500ms to allow wallet to update status
          }
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        WalletService.dispatchErrorEvent(error);
        throw error;
      }
    },
    
    // Disconnect
    disconnect: () => {
      try {
        suietWallet.disconnect();
        WalletService.dispatchDisconnectEvent();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
        WalletService.dispatchErrorEvent(error);
        throw error;
      }
    },
    
    // Sign and execute transaction
    signAndExecuteTransaction: async (transaction: WalletTransaction): Promise<SuiTransactionBlockResponse> => {
      if (!suietWallet.connected) {
        throw new Error('Wallet not connected');
      }
      
      try {
        // @ts-ignore - Handle interface differences between versions
        return await suietWallet.signAndExecuteTransactionBlock({
          transactionBlock: transaction.transactionBlock,
          ...transaction.options
        });
      } catch (error) {
        console.error('Transaction execution failed:', error);
        WalletService.dispatchErrorEvent(error);
        throw error;
      }
    }
  };
} 