'use client';

import { EnhancedConnectButton } from '@/components/wallet/enhanced-connect-button';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WalletService, WalletEvents } from '@/services/wallet-service';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function WalletConnectionPage() {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  // 监听钱包连接和断开事件
  useEffect(() => {
    // 连接事件处理函数
    const handleWalletConnect = (event: any) => {
      const { address } = event.detail;
      if (address) {
        setConnectedAddress(address);
        toast.success(`钱包已连接: ${address.substring(0, 10)}...`);
      }
    };

    // 断开连接事件处理函数
    const handleWalletDisconnect = () => {
      setConnectedAddress(null);
      toast.info('钱包已断开连接');
    };

    // 注册事件监听
    WalletService.addEventListener(WalletEvents.CONNECT, handleWalletConnect as any);
    WalletService.addEventListener(WalletEvents.DISCONNECT, handleWalletDisconnect as any);

    // 组件卸载时移除监听
    return () => {
      WalletService.removeEventListener(WalletEvents.CONNECT, handleWalletConnect as any);
      WalletService.removeEventListener(WalletEvents.DISCONNECT, handleWalletDisconnect as any);
    };
  }, []);

  const setRedirectUrl = () => {
    WalletService.setPostWalletConnectRedirectUrl('/dashboard');
    toast.info('设置连接后重定向到 /dashboard');
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Narval Finance 钱包连接</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">标准样式</h2>
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-4">默认按钮样式</p>
              <EnhancedConnectButton />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">样式变体</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">次要样式</p>
              <EnhancedConnectButton variant="secondary" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">轮廓样式</p>
              <EnhancedConnectButton variant="outline" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">小尺寸</p>
              <EnhancedConnectButton size="sm" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">大尺寸</p>
              <EnhancedConnectButton size="lg" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">配置选项</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">不显示地址</p>
              <EnhancedConnectButton showAddress={false} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">显示余额</p>
              <EnhancedConnectButton showBalance={true} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground mb-2">无下拉菜单</p>
              <EnhancedConnectButton showDropdown={false} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">重定向示例</h2>
          <div className="flex flex-col space-y-6">
            <p className="text-muted-foreground">
              演示连接钱包后如何重定向到其他页面。点击下方按钮设置重定向URL，然后连接钱包。
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={setRedirectUrl} variant="outline">
                设置重定向到 /dashboard
              </Button>
              <EnhancedConnectButton />
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">当前状态:</h3>
              <p>地址: {connectedAddress ? `${connectedAddress.substring(0, 10)}...` : '未连接'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
