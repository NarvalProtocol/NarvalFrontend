'use client';

import { ConnectWallet, CustomConnectWallet } from '@/components/wallet/connect-button';
import { SuiConnectButton, CustomSuiConnectButton } from '@/components/wallet/sui-connect-button';

export default function WalletPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Sui 钱包集成演示</h1>

      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-center">Suiet 钱包工具包</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">官方连接按钮</h3>
            <p className="text-muted-foreground mb-6 text-center">
              使用 Suiet Kit 原生的 ConnectButton 组件
            </p>
            <ConnectWallet />
          </div>

          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">自定义连接按钮</h3>
            <p className="text-muted-foreground mb-6 text-center">
              使用 useWallet 钩子构建自定义连接体验
            </p>
            <CustomConnectWallet />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-center">Mysten Dapp Kit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">官方连接按钮</h3>
            <p className="text-muted-foreground mb-6 text-center">
              使用 @mysten/dapp-kit 原生的 ConnectButton 组件
            </p>
            <SuiConnectButton />
          </div>

          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">自定义连接按钮</h3>
            <p className="text-muted-foreground mb-6 text-center">使用定制的连接文本</p>
            <CustomSuiConnectButton />
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">使用钱包功能</h2>
        <p className="text-muted-foreground mb-6">
          连接钱包后，您可以使用相应的 hooks 获取钱包信息并调用钱包功能。
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {`
// Suiet 钱包示例
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from "@mysten/sui/transactions";

// Mysten Dapp Kit 示例
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui/transactions';

function ExampleComponent() {
  // Suiet 钱包 hooks
  const wallet = useWallet();
  
  // Mysten Dapp Kit hooks
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();
  
  async function handleMoveCall() {
    if (!wallet.connected) return;
    
    const tx = new Transaction();
    const packageObjectId = "0x1";
    tx.moveCall({
      target: \`\${packageObjectId}::nft::mint\`,
      arguments: [tx.pure.string("Example NFT")],
    });
    
    try {
      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log('交易成功:', result);
    } catch (e) {
      console.error('交易失败:', e);
    }
  }
  
  // 使用 Mysten Dapp Kit 的方式
  function handleDappKitMoveCall() {
    const txb = new TransactionBlock();
    const packageObjectId = "0x1";
    txb.moveCall({
      target: \`\${packageObjectId}::nft::mint\`,
      arguments: [txb.pure.string("Example NFT")],
    });
    
    signAndExecute(
      {
        transactionBlock: txb,
      },
      {
        onSuccess: (result) => {
          console.log('交易成功:', result);
        },
        onError: (error) => {
          console.error('交易失败:', error);
        },
      }
    );
  }
  
  return (
    <div>
      <button onClick={handleMoveCall} disabled={!wallet.connected}>
        使用 Suiet 钱包铸造 NFT
      </button>
      <button onClick={handleDappKitMoveCall}>
        使用 Dapp Kit 铸造 NFT
      </button>
    </div>
  );
}
`}
        </pre>
      </div>
    </div>
  );
}
