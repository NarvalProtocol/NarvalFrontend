'use client';

import { EnhancedConnectButton } from '@/components/wallet/enhanced-connect-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WalletService, WalletEvents } from '@/services/wallet-service';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function WalletConnectionPage() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  // Listen for wallet connect and disconnect events
  useEffect(() => {
    // Connect event handler
    const handleWalletConnect = (event: any) => {
      const { address } = event.detail;
      if (address) {
        setConnectedAddress(address);
        toast.success(`Wallet connected: ${address.substring(0, 10)}...`);
      }
    };

    // Disconnect event handler
    const handleWalletDisconnect = () => {
      setConnectedAddress(null);
      toast.info('Wallet disconnected');
    };

    // Register event listeners
    WalletService.addEventListener(WalletEvents.CONNECT, handleWalletConnect as any);
    WalletService.addEventListener(WalletEvents.DISCONNECT, handleWalletDisconnect as any);

    // Remove listeners when component unmounts
    return () => {
      WalletService.removeEventListener(WalletEvents.CONNECT, handleWalletConnect as any);
      WalletService.removeEventListener(WalletEvents.DISCONNECT, handleWalletDisconnect as any);
    };
  }, []);

  const setRedirectUrl = () => {
    WalletService.setPostWalletConnectRedirectUrl('/dashboard');
    toast.info('Set redirect to /dashboard after connection');
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Narval Finance Wallet Connection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Standard Style</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-4">Default Button Style</p>
              <EnhancedConnectButton />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Style Variants</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Secondary Style</p>
              <EnhancedConnectButton variant="secondary" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Outline Style</p>
              <EnhancedConnectButton variant="outline" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Small Size</p>
              <EnhancedConnectButton size="sm" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Large Size</p>
              <EnhancedConnectButton size="lg" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Options</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Hide Address</p>
              <EnhancedConnectButton showAddress={false} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">Show Balance</p>
              <EnhancedConnectButton showBalance={true} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">No Dropdown</p>
              <EnhancedConnectButton showDropdown={false} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Redirect Example</h2>
          <div className="flex flex-col space-y-6">
            <p className="text-muted-foreground">
              Demonstrates how to redirect to another page after connecting a wallet. Click the button below to set the redirect URL, then connect your wallet.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={setRedirectUrl} variant="outline">
                Set Redirect to /dashboard
              </Button>
              <EnhancedConnectButton />
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Current Status:</h3>
              <p>Address: {connectedAddress ? `${connectedAddress.substring(0, 10)}...` : 'Not connected'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
