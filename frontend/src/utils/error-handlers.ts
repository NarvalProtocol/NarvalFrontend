'use client';

import { toast } from 'sonner';

/**
 * 从各种错误对象中提取错误消息
 */
export function getErrorMessage(error: any): string {
  if (!error) {
    return '发生未知错误';
  }

  // 如果是字符串，直接返回
  if (typeof error === 'string') {
    return error;
  }

  // 从不同的错误对象属性中查找错误消息
  const message = 
    error.message || 
    error.error?.message || 
    error.data?.message ||
    error.response?.data?.message ||
    error.error ||
    error.reason ||
    '发生未知错误';
  
  return message;
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
  
  return function(...args: Parameters<T>): void {
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
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
} 