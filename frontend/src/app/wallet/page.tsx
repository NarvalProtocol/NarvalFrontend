'use client';

import { ConnectWallet, CustomConnectWallet } from '@/components/wallet/connect-button';
import { SuiConnectButton, CustomSuiConnectButton } from '@/components/wallet/sui-connect-button';

export default function WalletPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Sui Wallet Integration Demo</h1>

      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-center">Suiet Wallet Kit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Official Connect Button</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Using Suiet Kit's native ConnectButton component
            </p>
            <ConnectWallet />
          </div>

          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Custom Connect Button</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Using useWallet hook to build custom connection experience
            </p>
            <CustomConnectWallet />
          </div>
        </div>
      </div>

      <div className="mb-8 pb-8 border-b">
        <h2 className="text-2xl font-bold mb-6 text-center">Mysten Dapp Kit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Official Connect Button</h3>
            <p className="text-muted-foreground mb-6 text-center">
              Using @mysten/dapp-kit native ConnectButton component
            </p>
            <SuiConnectButton />
          </div>

          <div className="border p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Custom Connect Button</h3>
            <p className="text-muted-foreground mb-6 text-center">Using custom connection text</p>
            <CustomSuiConnectButton />
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-semibold mb-4">Using Wallet Features</h2>
        <p className="text-muted-foreground mb-6">
          After connecting a wallet, you can use the corresponding hooks to get wallet information and call wallet functions.
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {`
// Suiet Wallet Example
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from "@mysten/sui/transactions";

// Mysten Dapp Kit Example
import { useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui/transactions';

function ExampleComponent() {
  // Suiet Wallet hooks
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
      console.log('Transaction successful:', result);
    } catch (e) {
      console.error('Transaction failed:', e);
    }
  }
  
  // Using Mysten Dapp Kit approach
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
          console.log('Transaction successful:', result);
        },
        onError: (error) => {
          console.error('Transaction failed:', error);
        },
      }
    );
  }
  
  return (
    <div>
      <button onClick={handleMoveCall} disabled={!wallet.connected}>
        Mint NFT using Suiet Wallet
      </button>
      <button onClick={handleDappKitMoveCall}>
        Mint NFT using Dapp Kit
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
