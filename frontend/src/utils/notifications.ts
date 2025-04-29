import { getErrorMessage } from './error-handlers';
import { useNotification } from '@/context/notification-context';

/**
 * 可以在React组件中使用的API错误处理钩子
 */
export function useApiErrorHandler() {
  const { showError } = useNotification();

  /**
   * 处理API错误并通过通知上下文显示错误
   */
  const handleApiError = (error: unknown, prefix: string = '请求失败'): void => {
    const message = getErrorMessage(error);
    showError(`${prefix}: ${message}`);
    console.error('API错误:', error);
  };

  /**
   * 包装异步API调用函数，处理错误并显示通知
   */
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    options: {
      loadingMessage?: string;
      successMessage?: string;
      errorPrefix?: string;
    } = {}
  ): Promise<T | undefined> => {
    const { loadingMessage, successMessage, errorPrefix = '请求失败' } = options;
    
    let loadingId;
    if (loadingMessage) {
      loadingId = useNotification().showLoading(loadingMessage);
    }
    
    try {
      const result = await fn();
      
      if (loadingId) {
        // 使用动态导入以避免循环依赖
        import('sonner').then(({ toast }) => {
          toast.dismiss(loadingId);
          if (successMessage) {
            toast.success(successMessage);
          }
        });
      } else if (successMessage) {
        useNotification().showSuccess(successMessage);
      }
      
      return result;
    } catch (error) {
      if (loadingId) {
        // 使用动态导入以避免循环依赖
        import('sonner').then(({ toast }) => {
          toast.dismiss(loadingId);
        });
      }
      
      handleApiError(error, errorPrefix);
      return undefined;
    }
  };

  return {
    handleApiError,
    withErrorHandling,
  };
}

/**
 * 可以在React组件中使用的区块链错误处理钩子
 */
export function useBlockchainErrorHandler() {
  const { showError, showWarning, showSuccess, showLoading } = useNotification();

  /**
   * 处理区块链错误并显示用户友好的消息
   */
  const handleBlockchainError = (error: unknown, operation: string = '区块链操作'): void => {
    let message = getErrorMessage(error);

    // 针对区块链错误的友好消息
    if (message.includes('user rejected') || message.includes('user denied')) {
      message = '用户取消了交易';
    } else if (message.includes('insufficient funds') || message.includes('balance')) {
      message = '余额不足以完成交易';
    } else if (message.includes('gas')) {
      message = '燃料费用估算错误，请重试或调整燃料设置';
    } else if (message.includes('timeout')) {
      message = '交易超时，网络可能拥堵';
    } else if (message.includes('nonce')) {
      message = '交易序号(nonce)错误，请刷新页面重试';
    }

    showError(`${operation}失败: ${message}`);
    console.error('区块链错误:', error);
  };

  /**
   * 包装区块链交易函数，处理常见的交易流程和错误
   */
  const executeTransaction = async <T>(
    fn: () => Promise<T>,
    options: {
      pendingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      operationName?: string;
    } = {}
  ): Promise<T | undefined> => {
    const {
      pendingMessage = '交易处理中...',
      successMessage = '交易已成功',
      errorMessage,
      operationName = '交易',
    } = options;

    let loadingId;
    if (pendingMessage) {
      loadingId = showLoading(pendingMessage);
    }

    try {
      const result = await fn();

      if (loadingId) {
        // 使用动态导入以避免循环依赖
        import('sonner').then(({ toast }) => {
          toast.dismiss(loadingId);
          if (successMessage) {
            toast.success(successMessage);
          }
        });
      } else if (successMessage) {
        showSuccess(successMessage);
      }

      return result;
    } catch (error) {
      if (loadingId) {
        // 使用动态导入以避免循环依赖
        import('sonner').then(({ toast }) => {
          toast.dismiss(loadingId);
        });
      }

      handleBlockchainError(error, errorMessage || operationName);
      return undefined;
    }
  };

  return {
    handleBlockchainError,
    executeTransaction,
  };
} 