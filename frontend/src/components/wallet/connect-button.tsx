'use client';

import { ConnectButton as SuietConnectButton } from '@suiet/wallet-kit';
import { useWallet } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { WALLET } from '@/constants';

export function ConnectWallet() {
  // Directly use the native connect button provided by Suiet
  return <SuietConnectButton />;
}

export function CustomConnectWallet() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setIsLoading(true);
      // Set connection timeout
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, WALLET.CONNECT_TIMEOUT);
      
      await wallet.select('Select Wallet');
      
      clearTimeout(timeout);
      setIsLoading(false);
    } catch (error) {
      console.error('Wallet connection error:', error);
      setIsLoading(false);
    }
  };

  // This is a custom connect button example, showing how to use the wallet hook
  return (
    <div className="flex flex-col items-center gap-2">
      {wallet.connected ? (
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">Connected to: {wallet.name}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {wallet.account?.address}
          </p>
          <Button variant="outline" size="sm" onClick={() => wallet.disconnect()} className="mt-2">
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={handleConnect} 
          variant="default" 
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
}
