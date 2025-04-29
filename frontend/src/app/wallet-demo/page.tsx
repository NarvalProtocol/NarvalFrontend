'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { EnhancedConnectButton } from '@/components/wallet/enhanced-connect-button';
import { formatTokenAmount, truncateAddress } from '@/utils/format';
import { showSuccess, showError } from '@/utils/notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle, ArrowRightIcon } from 'lucide-react';
import { blockchainClient } from '@/services/blockchain-client';

export default function WalletDemoPage() {
  const wallet = useWallet();
  const { connected, connecting, select, disconnect, account, chain } = wallet;
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);

  // Get SUI balance
  const fetchBalance = async () => {
    if (!account?.address) return;

    try {
      setLoading(true);
      // Use blockchain client to get balance
      const totalBalance = await blockchainClient.getBalance(account.address);
      setBalance(totalBalance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      showError('Failed to get balance');
    } finally {
      setLoading(false);
    }
  };

  // Execute a simple transaction
  const executeTransaction = async () => {
    if (!connected || !account) {
      showError('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      // Create transaction, this is a simple self-transfer example
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
      tx.transferObjects([coin], tx.pure(account.address));

      // Send transaction
      const result = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });

      console.log('Transaction result:', result);
      showSuccess('Transaction successfully executed');
    } catch (error) {
      console.error('Transaction failed:', error);
      showError('Transaction execution failed');
    } finally {
      setLoading(false);
    }
  };

  // Automatically get balance when wallet is connected
  useEffect(() => {
    if (connected && account) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, account]);

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Wallet Demo</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wallet Connection</CardTitle>
          <CardDescription>Connect your SUI wallet to use blockchain features</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <EnhancedConnectButton showNetworkIndicator showBalance size="lg" />
            </div>

            {connected && account && (
              <div className="text-sm text-muted-foreground">
                <div>Wallet Address: {truncateAddress(account.address)}</div>
                <div>Network: {chain?.name || 'Unknown'}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {connected && account && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
              <CardDescription>View your SUI account balance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold">
                  {balance !== null ? (
                    formatTokenAmount(balance, { symbol: 'SUI', decimals: 9 })
                  ) : (
                    <span className="text-muted-foreground">Loading...</span>
                  )}
                </div>
                <Button onClick={fetchBalance} variant="outline" disabled={loading}>
                  Refresh Balance
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Transaction Example</CardTitle>
              <CardDescription>Execute a simple blockchain transaction</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Sample Transaction</AlertTitle>
                <AlertDescription>
                  This will execute a simple self-transfer transaction, transferring 0.000001 SUI to
                  your own address.
                </AlertDescription>
              </Alert>

              <Button onClick={executeTransaction} disabled={loading} className="w-full">
                <ArrowRightIcon className="mr-2 h-4 w-4" />
                Execute Sample Transaction
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {!connected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to use the features on this page.
          </AlertDescription>
        </Alert>
      )}
    </main>
  );
}
