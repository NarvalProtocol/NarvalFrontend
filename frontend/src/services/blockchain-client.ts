'use client';

import { toast } from 'sonner';
import { handleBlockchainError, retryOperation } from '@/utils/error-handlers';

/**
 * 区块链客户端，集成错误处理
 */
export class BlockchainClient {
  /**
   * 执行区块链交易，带有错误处理和多次尝试
   */
  static async executeTransaction<T>(
    transactionFn: () => Promise<T>,
    {
      onBefore,
      onSuccess,
      onError,
      transactionName = '交易',
      maxRetries = 1,
      showLoadingToast = true,
    }: {
      onBefore?: () => void;
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
      transactionName?: string;
      maxRetries?: number;
      showLoadingToast?: boolean;
    } = {}
  ): Promise<T | null> {
    try {
      // 执行交易前的回调
      if (onBefore) {
        onBefore();
      }

      // 显示加载中提示
      let toastId;
      if (showLoadingToast) {
        toastId = toast.loading(`${transactionName}正在处理中...`);
      }

      // 执行交易，可以重试指定次数
      const result = await retryOperation(
        async () => {
          return await transactionFn();
        },
        maxRetries
      );

      // 清除加载中提示
      if (toastId) {
        toast.dismiss(toastId);
      }

      // 显示成功提示
      toast.success(`${transactionName}已成功`);

      // 执行成功回调
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      // 处理区块链错误
      handleBlockchainError(error, transactionName);

      // 执行错误回调
      if (onError) {
        onError(error);
      }

      // 记录错误
      console.error(`区块链交易错误 (${transactionName}):`, error);

      return null;
    }
  }

  /**
   * 查询区块链数据，带有错误处理
   */
  static async queryBlockchain<T>(
    queryFn: () => Promise<T>,
    {
      queryName = '查询',
      maxRetries = 2,
      showLoadingToast = false,
    }: {
      queryName?: string;
      maxRetries?: number;
      showLoadingToast?: boolean;
    } = {}
  ): Promise<T | null> {
    try {
      // 显示加载中提示
      let toastId;
      if (showLoadingToast) {
        toastId = toast.loading(`${queryName}正在进行中...`);
      }

      // 执行查询，可以重试指定次数
      const result = await retryOperation(
        async () => {
          return await queryFn();
        },
        maxRetries
      );

      // 清除加载中提示
      if (toastId) {
        toast.dismiss(toastId);
      }

      return result;
    } catch (error) {
      // 处理区块链错误
      handleBlockchainError(error, queryName);

      // 记录错误
      console.error(`区块链查询错误 (${queryName}):`, error);

      return null;
    }
  }

  /**
   * 检查钱包连接状态，如未连接则提示
   */
  static checkWalletConnection(walletConnected: boolean): boolean {
    if (!walletConnected) {
      toast.error('请先连接钱包');
      return false;
    }
    return true;
  }

  /**
   * 监听区块链事件
   */
  static setupEventListener(
    listenerFn: () => any,
    cleanupFn: () => void,
    eventName = '事件'
  ): () => void {
    try {
      const listener = listenerFn();
      return () => {
        try {
          cleanupFn();
        } catch (error) {
          console.error(`清理${eventName}监听器错误:`, error);
        }
      };
    } catch (error) {
      console.error(`设置${eventName}监听器错误:`, error);
      toast.error(`无法监听${eventName}`);
 