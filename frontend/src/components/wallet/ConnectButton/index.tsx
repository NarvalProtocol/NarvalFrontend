'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '../WalletProvider';
import { WalletConnectionStatus } from '../adapters';
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

export interface ConnectButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  showAddress?: boolean;
  showBalance?: boolean;
  showNetwork?: boolean;
  showDropdown?: boolean;
}

/**
 * 统一的钱包连接按钮
 * 支持多种钱包适配器，并提供一致的用户体验
 */
export function ConnectButton({
  variant = 'default',
  size = 'default',
  className = '',
  showAddress = true,
  showBalance = false,
  showNetwork = false,
  showDropdown = true,
}: ConnectButtonProps) {
  const {
    status,
    account,
    balance,
    isConnecting,
    network,
    connect,
    disconnect,
    getAddress,
  } = useWallet();
  
  // 复制地址到剪贴板
  const copyAddress = () => {
    const address = getAddress();
    if (address) {
      navigator.clipboard.writeText(address);
      showSuccess('地址已复制到剪贴板');
    }
  };
  
  // 连接中显示加载状态
  if (isConnecting || status === WalletConnectionStatus.CONNECTING) {
    return (
      <Button variant={variant} size={size} className={`${className}`} disabled>
        <span className="inline-block w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
        连接中...
      </Button>
    );
  }
  
  // 已连接状态
  if (status === WalletConnectionStatus.CONNECTED && account) {
    // 有下拉菜单的按钮
    if (showDropdown) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className={className}>
              {showNetwork && network && (
                <span className="mr-2 text-xs opacity-80">{network}</span>
              )}
              {showAddress && account.address && truncateAddress(account.address)}
              {showBalance && balance && (
                <span className="ml-2 text-xs font-normal opacity-80">
                  {Number(balance.amount) / Math.pow(10, balance.decimals)} {balance.symbol}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>钱包</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddress}>
              <CopyIcon className="mr-2 size-4" />
              复制地址
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => disconnect()}>
              <LogOutIcon className="mr-2 size-4" />
              断开连接
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // 无下拉菜单的简单按钮
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => disconnect()}
      >
        {showAddress && account.address && truncateAddress(account.address)}
        {showBalance && balance && (
          <span className="ml-2 text-xs font-normal opacity-80">
            {Number(balance.amount) / Math.pow(10, balance.decimals)} {balance.symbol}
          </span>
        )}
      </Button>
    );
  }
  
  // 未连接状态
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className} 
      onClick={() => connect()}
    >
      连接钱包
    </Button>
  );
} 