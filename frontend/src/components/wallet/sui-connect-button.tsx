'use client';

import { ConnectButton } from '@mysten/dapp-kit';
import { Button } from '@/components/ui/button';
import { type ReactNode } from 'react';

export function SuiConnectButton() {
  return <ConnectButton />;
}

export function CustomSuiConnectButton() {
  return <ConnectButton connectText="连接 Sui 钱包" />;
}

// 由于 ConnectButton 组件的类型问题，暂时简化此组件
export function ButtonSuiConnectButton() {
  return <ConnectButton connectText="连接 Sui 钱包" />;
}
