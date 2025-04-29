'use client';

import { toast } from 'sonner';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  SERVER = 'server',
  CLIENT = 'client',
  UNKNOWN = 'unknown',
  WALLET = 'wallet',
  BLOCKCHAIN = 'blockchain',
}

/**
 * 应用程序错误接口
 */
export interface AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  context?: string;
  originalError?: unknown;
}

/**
 * 创建应用程序错误对象
 */
export function createAppError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  options: {
    statusCode?: number;
    context?: string;
    originalError?: unknown;
  } = {}
): AppError {
  const { statusCode, context, originalError } = options;
  const error = new Error(message) as AppError;
  error.type = type;

  if (statusCode) error.statusCode = statusCode;
  if (context) error.context = context;
  if (originalError) error.originalError = originalError;

  return error;
}

/**
 * 处理并格式化错误对象
 */
export function handleError(
  error: unknown,
  options: {
    silent?: boolean;
    context?: string;
    fallbackMessage?: string;
  } = {}
): AppError {
  const { silent = false, context, fallbackMessage = '发生未知错误' } = options;

  // 如果已经是 AppError，直接返回
  if (isAppError(error)) {
    if (context && !error.context) {
      error.context = context;
    }
    if (!silent) {
      console.error(
        `[ERROR][${error.type}]${context ? `[${context}]` : ''}: ${error.message}`,
        error
      );
    }
    return error;
  }

  // 转换为 AppError
  const appError = convertToAppError(error, fallbackMessage, context);

  if (!silent) {
    console.error(
      `[ERROR][${appError.type}]${context ? `[${context}]` : ''}: ${appError.message}`,
      appError
    );
  }

  return appError;
}

/**
 * 检查对象是否为应用程序错误
 */
function isAppError(error: unknown): error is AppError {
  return (
    error instanceof Error &&
    'type' in error &&
    Object.values(ErrorType).includes((error as AppError).type)
  );
}

/**
 * 将未知错误转换为应用程序错误
 */
function convertToAppError(error: unknown, fallbackMessage: string, context?: string): AppError {
  let message = fallbackMessage;
  let type = ErrorType.UNKNOWN;
  let statusCode: number | undefined;

  if (error instanceof Error) {
    message = error.message || fallbackMessage;

    // 检查错误类型
    if (
      error.name === 'NetworkError' ||
      message.includes('network') ||
      message.includes('offline')
    ) {
      type = ErrorType.NETWORK;
    } else if (
      error.name === 'AuthenticationError' ||
      message.includes('unauthorized') ||
      message.includes('unauthenticated')
    ) {
      type = ErrorType.AUTHENTICATION;
    } else if (
      error.name === 'ValidationError' ||
      message.includes('validation') ||
      message.includes('invalid')
    ) {
      type = ErrorType.VALIDATION;
    } else if (message.includes('not found') || message.includes('404')) {
      type = ErrorType.NOT_FOUND;
    } else if (message.includes('server') || message.includes('5xx')) {
      type = ErrorType.SERVER;
    }

    // 尝试获取状态码
    if ('statusCode' in error) {
      statusCode = Number(error.statusCode);
    } else if (message.includes('404')) {
      statusCode = 404;
    } else if (message.includes('401') || message.includes('unauthorized')) {
      statusCode = 401;
    } else if (message.includes('403') || message.includes('forbidden')) {
      statusCode = 403;
    } else if (message.includes('500')) {
      statusCode = 500;
    }
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      message = error.message;
    }
    if ('statusCode' in error && typeof error.statusCode === 'number') {
      statusCode = error.statusCode;
    }
  }

  return createAppError(message, type, {
    statusCode,
    context,
    originalError: error,
  });
}

/**
 * 获取错误消息文本
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return '未知错误';
}

/**
 * Global unhandled error handler
 */
export function setupGlobalErrorHandlers() {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', event => {
      console.error('Unhandled promise rejection:', event.reason);

      handleError(event.reason, {
        context: 'UnhandledRejection',
        fallbackMessage: 'Unhandled promise rejection occurred',
      });

      event.preventDefault();
    });

    // Handle uncaught errors
    window.addEventListener('error', event => {
      console.error('Uncaught error:', event.error);

      handleError(event.error, {
        context: 'UncaughtError',
        fallbackMessage: 'Uncaught error occurred',
      });

      event.preventDefault();
    });
  }
}

/**
 * 处理区块链相关错误，显示友好消息
 */
export function handleBlockchainError(error: any, operation: string = '操作'): void {
  // 提取错误消息
  let errorMessage = getErrorMessage(error);

  // 处理常见的区块链错误类型
  if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
    toast.error(`用户取消了${operation}`);
    return;
  }

  if (errorMessage.includes('insufficient funds')) {
    toast.error(`余额不足，无法完成${operation}`);
    return;
  }

  if (errorMessage.includes('nonce')) {
    toast.error(`交易nonce错误，请刷新页面重试`);
    return;
  }

  if (errorMessage.includes('gas')) {
    toast.error(`Gas费用估算失败，请调整参数后重试`);
    return;
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    toast.error(`${operation}超时，请检查网络后重试`);
    return;
  }

  if (errorMessage.includes('network') || errorMessage.includes('Network')) {
    toast.error(`网络错误，请检查您的连接后重试`);
    return;
  }

  // 显示通用错误信息
  toast.error(`${operation}失败: ${errorMessage}`);
}

/**
 * 处理API错误，显示友好消息
 */
export function handleApiError(error: any, operation: string = '请求'): void {
  // 提取错误消息
  let errorMessage = getErrorMessage(error);
  const statusCode = error?.response?.status || error?.status;

  // 处理常见的HTTP状态码
  if (statusCode) {
    switch (statusCode) {
      case 400:
        toast.error(`请求参数错误: ${errorMessage}`);
        return;
      case 401:
        toast.error('您尚未登录或登录已过期，请重新登录');
        // 这里可以添加重定向到登录页的逻辑
        return;
      case 403:
        toast.error('您没有权限执行此操作');
        return;
      case 404:
        toast.error(`未找到请求的资源: ${errorMessage}`);
        return;
      case 429:
        toast.error('请求过于频繁，请稍后再试');
        return;
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('服务器错误，请稍后再试');
        return;
    }
  }

  // 网络连接问题
  if (error.name === 'NetworkError' || !navigator.onLine) {
    toast.error('网络连接错误，请检查您的网络');
    return;
  }

  // 显示通用错误信息
  toast.error(`${operation}失败: ${errorMessage}`);
}

/**
 * 重试函数，可以在失败时多次尝试
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // 尝试执行操作
      return await operation();
    } catch (error) {
      lastError = error;

      // 如果已经达到最大重试次数，则不再重试
      if (attempt >= maxRetries) {
        break;
      }

      // 等待一段时间后重试（每次重试增加等待时间）
      const waitTime = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // 如果所有尝试都失败，抛出最后一个错误
  throw lastError;
}

/**
 * 防抖函数，用于限制函数调用频率
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * 节流函数，用于限制函数调用频率
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
