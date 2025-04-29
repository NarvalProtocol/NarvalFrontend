'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';

export function SuiConnectButton() {
  return <ConnectButton />;
}

export function CustomSuiConnectButton() {
  return <ConnectButton connectText="Connect Sui Wallet" />;
}

// Due to type issues with the ConnectButton component, this component is simplified
export function ButtonSuiConnectButton() {
  return <ConnectButton connectText="Connect Sui Wallet" />;
}
