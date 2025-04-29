import { useWallet } from '../WalletProvider';
import { WalletTransaction } from '../adapters';
import { showSuccess, showError } from '@/utils/notifications';

/**
 * 钱包交易钩子，提供交易相关操作的简化接口
 */
export function useWalletTransactions() {
  const { 
    status, 
    signAndExecuteTransaction, 
    getAddress 
  } = useWallet();

  /**
   * 执行交易
   * @param transaction 交易配置
   * @param options 选项（onSuccess, onError回调等）
   */
  const executeTransaction = async (
    transaction: WalletTransaction,
    options?: {
      onSuccess?: (result: any) => void;
      onError?: (error: any) => void;
      showNotifications?: boolean;
    }
  ) => {
    const {
      onSuccess,
      onError,
      showNotifications = true
    } = options || {};

    try {
      // 执行交易
      const result = await signAndExecuteTransaction(transaction);
      
      // 成功回调
      if (onSuccess) {
        onSuccess(result);
      }
      
      // 显示成功通知
      if (showNotifications) {
        showSuccess('交易执行成功');
      }
      
      return result;
    } catch (error) {
      // 错误回调
      if (onError) {
        onError(error);
      }
      
      // 显示错误通知
      if (showNotifications) {
        showError('交易执行失败');
      }
      
      throw error;
    }
  };

  /**
   * 检查钱包是否已连接
   */
  const isWalletReady = () => {
    return status === 'connected' && !!getAddress();
  };

  return {
    executeTransaction,
    isWalletReady
  };
} 