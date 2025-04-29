import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WALLET } from '@/constants';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  walletName: string | null;
  // Actions
  setConnected: (isConnected: boolean) => void;
  setWalletInfo: (address: string, walletName: string) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      isConnected: false,
      address: null,
      walletName: null,
      
      setConnected: (isConnected) => set({ isConnected }),
      setWalletInfo: (address, walletName) => set({ address, walletName, isConnected: true }),
      disconnect: () => set({ isConnected: false, address: null, walletName: null }),
    }),
    {
      name: WALLET.STORAGE_KEY, // Use storage key defined in constants
    }
  )
); 