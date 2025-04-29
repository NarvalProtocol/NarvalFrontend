'use client';

import { ConnectButton } from '@/components/wallet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WalletService, WalletEvents } from '@/services/wallet-service';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NotificationTest } from '@/components/test/notification-test';
import { ErrorTest } from '@/components/test/error-test';

export default function TestPage() {
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
    console.log('Setting redirect URL');
    WalletService.setRedirectUrl('/dashboard');
    // Confirm URL has been set
    const currentUrl = WalletService.getRedirectUrl();
    console.log('Redirect URL has been set to:', currentUrl);
    toast.info(`Redirect set to: ${currentUrl}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Comprehensive Test Page</h1>

      {/* Wallet Connection Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Wallet Connection Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Standard Styles</h2>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-4">Default Button Style</p>
                <ConnectButton />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Style Variants</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Secondary Style</p>
                <ConnectButton variant="secondary" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Outline Style</p>
                <ConnectButton variant="outline" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Small Size</p>
                <ConnectButton size="sm" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Large Size</p>
                <ConnectButton size="lg" />
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
                <ConnectButton showAddress={false} />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">Show Balance</p>
                <ConnectButton showBalance={true} />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-muted-foreground mb-2">No Dropdown</p>
                <ConnectButton showDropdown={false} />
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
                <ConnectButton />
              </div>
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Current Status:</h3>
                <p>Address: {connectedAddress ? `${connectedAddress.substring(0, 10)}...` : 'Not Connected'}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Notification Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Notification Test</h2>
        <Card className="p-6">
          <NotificationTest />
        </Card>
      </section>

      {/* Error Boundary Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Error Boundary Test</h2>
        <Card className="p-6">
          <div className="text-center mb-6">
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This component demonstrates how error boundaries work in React. When you click the "Trigger Error" button, an error will be thrown,
              but the error boundary will catch it and display a fallback UI instead of crashing the entire application.
            </p>
          </div>
          <ErrorTest />
        </Card>
      </section>
    </div>
  );
}
