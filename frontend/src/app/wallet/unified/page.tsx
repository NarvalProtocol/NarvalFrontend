'use client';

import React from 'react';
import { ConnectButton } from '@/components/wallet';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/components/wallet';
import { useWalletTransactions } from '@/components/wallet/hooks';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, AlertCircle, ArrowRightIcon } from 'lucide-react';

export default function UnifiedWalletPage() {
  const wallet = useWallet();
  const { executeTransaction, isWalletReady } = useWalletTransactions();
  
  // 执行示例交易
  const handleExecuteTransaction = async () => {
    if (!isWalletReady() || !wallet.account) {
      return;
    }
    
    try {
      // 创建交易，一个简单的自转账示例
      const tx = new TransactionBlock();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(1000)]);
      tx.transferObjects([coin], tx.pure(wallet.account.address));
      
      // 执行交易
      await executeTransaction(
        { transactionBlock: tx },
        {
          onSuccess: (result) => {
            console.log('交易成功:', result);
          },
          onError: (error) => {
            console.error('交易失败:', error);
          }
        }
      );
    } catch (error) {
      console.error('交易准备失败:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">统一钱包接口演示</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>钱包连接</CardTitle>
            <CardDescription>连接您的SUI钱包以使用区块链功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ConnectButton size="lg" showBalance showNetwork />
              
              {wallet.account && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>钱包状态：{wallet.status}</p>
                  <p>适配器类型：{wallet.getAdapterType()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>连接按钮样式</CardTitle>
            <CardDescription>多种按钮样式变体</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">默认样式</p>
                <ConnectButton />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">次要样式</p>
                <ConnectButton variant="secondary" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">轮廓样式</p>
                <ConnectButton variant="outline" />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-2">小尺寸</p>
                <ConnectButton size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {isWalletReady() ? (
        <Card>
          <CardHeader>
            <CardTitle>交易示例</CardTitle>
            <CardDescription>执行一个简单的区块链交易</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>示例交易</AlertTitle>
              <AlertDescription>
                这将执行一个简单的自转账交易，转移0.000001 SUI到您自己的地址。
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleExecuteTransaction}>
              <ArrowRightIcon className="mr-2 h-4 w-4" />
              执行示例交易
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>钱包未连接</AlertTitle>
          <AlertDescription>
            请连接您的钱包以使用此页面上的功能。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
} 