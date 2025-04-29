'use client';

import { Button } from '@/components/ui/button';
import { useWalletService } from '@/services/wallet-service';
import { 
  Copy, 
  ExternalLink, 
  ChevronDown, 
  LogOut, 
  Wallet 
} from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-toastify';

export interface EnhancedConnectButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showAddress?: boolean;
  showBalance?: boolean;
  showDropdown?: boolean;
  className?: string;
}

/**
 * 增强的钱包连接按钮
 * 支持显示地址、余额和钱包操作下拉菜单
 */
export function EnhancedConnectButton({
  variant = 'default',
  size = 'default',
  showAddress = true,
  showBalance = false,
  showDropdown = true,
  className = '',
}: EnhancedConnectButtonProps) {
  const { walletStatus, connectWallet, disconnectWallet } = useWalletService();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /**
   * 复制钱包地址到剪贴板
   */
  const copyAddressToClipboard = () => {
    if (walletStatus.address) {
      navigator.clipboard.writeText(walletStatus.address);
      toast.success('地址已复制到剪贴板');
      setIsDropdownOpen(false);
    }
  };

  /**
   * 在区块浏览器中查看地址
   */
  const viewAddressInExplorer = () => {
    if (walletStatus.address) {
      const explorerUrl = `https://explorer.sui.io/address/${walletStatus.address}`;
      window.open(explorerUrl, '_blank');
      setIsDropdownOpen(false);
    }
  };

  // 已连接状态
  if (walletStatus.connected && walletStatus.address) {
    // 带下拉菜单的连接按钮
    if (showDropdown) {
      return (
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant === 'default' ? 'outline' : variant}
              size={size}
              className={`flex items-center gap-2 ${className}`}
            >
              <Wallet className="h-4 w-4" />
              {showAddress && (
                <span className="text-sm font-medium">
                  {walletStatus.displayAddress}
                </span>
              )}
              {showBalance && (
                <span className="text-sm font-medium ml-1">
                  {/* 这里假设有余额信息 */}
                  {/* {formatSUI(walletStatus.balance)} SUI */}
                  0.00 SUI
                </span>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-semibold">
              {walletStatus.walletName || '已连接钱包'}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddressToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              <span>复制地址</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={viewAddressInExplorer}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>在浏览器中查看</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={disconnectWallet}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>断开连接</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // 不带下拉菜单的简单连接按钮
    return (
      <Button
        variant={variant === 'default' ? 'outline' : variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={disconnectWallet}
      >
        <Wallet className="h-4 w-4" />
        {showAddress && (
          <span className="text-sm font-medium">{walletStatus.displayAddress}</span>
        )}
        {showBalance && (
          <span className="text-sm font-medium ml-1">
            {/* 这里假设有余额信息 */}
            0.00 SUI
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
      className={`flex items-center gap-2 ${className}`}
      onClick={connectWallet}
      disabled={walletStatus.connecting}
    >
      <Wallet className="h-4 w-4" />
      <span>{walletStatus.connecting ? '连接中...' : '连接钱包'}</span>
    </Button>
  );
} 