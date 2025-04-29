'use client';

import React from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/utils/format';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CopyIcon, LogOutIcon } from 'lucide-react';
import { showSuccess } from '@/utils/notifications';

interface EnhancedConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showBalance?: boolean;
  showNetworkIndicator?: boolean;
  showChainName?: boolean;
}

/**
 * Enhanced wallet connect button
 * Supports displaying address, balance and wallet operations dropdown menu
 */
export function EnhancedConnectButton({
  variant = 'default',
  size = 'default',
  className = '',
  showBalance = false,
  showNetworkIndicator = false,
  showChainName = false,
}: EnhancedConnectButtonProps) {
  const wallet = useWallet();
  const { connected, connecting, select, disconnect, chain, account } = wallet;

  // For type safety, we need to handle the balance correctly
  const walletBalance = 'balance' in wallet ? wallet.balance : undefined;

  const handleConnect = async () => {
    try {
      if (connecting) return;
      await select();
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      showSuccess({ message: 'Address copied to clipboard' });
    }
  };

  // Display loading state while connecting
  if (connecting) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <span className="inline-block w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Connecting...
      </Button>
    );
  }

  // Display wallet details if connected
  if (connected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size} className={className}>
            {showNetworkIndicator && <span className="mr-2 size-2 rounded-full bg-green-500" />}
            {showChainName && chain?.name && (
              <span className="mr-2 text-xs opacity-80">{chain.name}</span>
            )}
            {truncateAddress(account.address)}
            {showBalance && walletBalance !== undefined && (
              <span className="ml-2 text-xs font-normal opacity-80">
                {Number(walletBalance) / 1_000_000_000} SUI
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <CopyIcon className="mr-2 size-4" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDisconnect}>
            <LogOutIcon className="mr-2 size-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Display connect button if not connected
  return (
    <Button variant={variant} size={size} className={className} onClick={handleConnect}>
      Connect Wallet
    </Button>
  );
}
