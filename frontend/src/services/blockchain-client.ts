'use client';

import { toast } from 'sonner';
import { handleBlockchainError, retryOperation } from '@/utils/error-handlers';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bcs } from '@mysten/sui.js/bcs';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { createAppError, ErrorType, handleError } from '@/utils/error-handlers';

/**
 * 支持的链网络类型
 */
export enum NetworkType {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
  LOCALNET = 'localnet',
}

/**
 * 区块链客户端配置
 */
interface BlockchainClientConfig {
  network: NetworkType;
  customRpcUrl?: string;
}

/**
 * 区块链客户端服务，用于与Sui网络交互
 */
class BlockchainClient {
  private client: SuiClient;
  private network: NetworkType;

  constructor(config: BlockchainClientConfig = { network: NetworkType.TESTNET }) {
    this.network = config.network;
    const rpcUrl = config.customRpcUrl || this.getNetworkRpcUrl(config.network);
    this.client = new SuiClient({ url: rpcUrl });
  }

  /**
   * 获取SUI客户端实例
   */
  public getSuiClient(): SuiClient {
    return this.client;
  }

  /**
   * 获取当前网络类型
   */
  public getNetwork(): NetworkType {
    return this.network;
  }

  /**
   * 切换网络
   */
  public switchNetwork(network: NetworkType, customRpcUrl?: string): void {
    this.network = network;
    const rpcUrl = customRpcUrl || this.getNetworkRpcUrl(network);
    this.client = new SuiClient({ url: rpcUrl });
  }

  /**
   * 获取网络RPC URL
   */
  private getNetworkRpcUrl(network: NetworkType): string {
    switch (network) {
      case NetworkType.MAINNET:
        return getFullnodeUrl('mainnet');
      case NetworkType.TESTNET:
        return getFullnodeUrl('testnet');
      case NetworkType.DEVNET:
        return getFullnodeUrl('devnet');
      case NetworkType.LOCALNET:
        return 'http://localhost:9000';
      default:
        return getFullnodeUrl('testnet');
    }
  }

  /**
   * 获取账户余额
   */
  public async getBalance(address: string): Promise<bigint> {
    try {
      const { totalBalance } = await this.client.getBalance({
        owner: address,
      });

      return totalBalance;
    } catch (error) {
      throw handleError(error, {
        context: 'BlockchainClient.getBalance',
        fallbackMessage: '无法获取账户余额',
      });
    }
  }

  /**
   * 获取账户所拥有的NFT
   */
  public async getOwnedObjects(address: string, options?: { limit?: number; cursor?: string }) {
    try {
      const response = await this.client.getOwnedObjects({
        owner: address,
        limit: options?.limit,
        cursor: options?.cursor,
      });

      return response;
    } catch (error) {
      throw handleError(error, {
        context: 'BlockchainClient.getOwnedObjects',
        fallbackMessage: '无法获取账户拥有的对象',
      });
    }
  }

  /**
   * 获取对象详细信息
   */
  public async getObject(objectId: string) {
    try {
      const object = await this.client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showOwner: true,
        },
      });

      return object;
    } catch (error) {
      throw handleError(error, {
        context: 'BlockchainClient.getObject',
        fallbackMessage: '无法获取对象信息',
      });
    }
  }

  /**
   * 执行交易
   */
  public async executeTransaction(
    transactionBlock: TransactionBlock,
    signer: any,
    options?: {
      requestType?: 'WaitForLocalExecution' | 'WaitForEffectsCert';
    }
  ) {
    try {
      if (!signer) {
        throw createAppError('未提供签名者', ErrorType.WALLET);
      }

      const result = await signer.signAndExecuteTransactionBlock({
        transactionBlock,
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true,
          showInput: true,
          ...options,
        },
      });

      return result;
    } catch (error) {
      throw handleError(error, {
        context: 'BlockchainClient.executeTransaction',
        fallbackMessage: '执行交易失败',
      });
    }
  }

  /**
   * 获取交易详情
   */
  public async getTransaction(digest: string) {
    try {
      const txn = await this.client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showInput: true,
          showObjectChanges: true,
          showEvents: true,
        },
      });

      return txn;
    } catch (error) {
      throw handleError(error, {
        context: 'BlockchainClient.getTransaction',
        fallbackMessage: '无法获取交易详情',
      });
    }
  }
}

// 导出单例实例
const blockchainClient = new BlockchainClient({ network: NetworkType.TESTNET });
export { blockchainClient };
