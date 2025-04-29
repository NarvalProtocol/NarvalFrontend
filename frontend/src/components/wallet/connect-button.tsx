'use client';

import { ConnectButton as SuietConnectButton } from '@suiet/wallet-kit';
import { useWallet } from '@suiet/wallet-kit';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ConnectWallet() {
  // 直接使用Suiet提供的原生连接按钮
  return <SuietConnectButton />;
}

export function CustomConnectWallet() {
  const wallet = useWallet();

  // 这是一个自定义的连接按钮示例，展示如何使用钱包挂钩
  return (
    <div className="flex flex-col items-center gap-2">
      {wallet.connected ? (
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">已连接到：{wallet.name}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
            {wallet.account?.address}
          </p>
          <Button variant="outline" size="sm" onClick={() => wallet.disconnect()} className="mt-2">
            断开连接
          </Button>
        </div>
      ) : (
        <Button onClick={() => wallet.select('选择钱包')} variant="default">
          连接钱包
        </Button>
      )}
    </div>
  );
}
