'use client';

import { toast } from 'sonner';

/**
 * Error type enumeration
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
 * Application error interface
 */
export interface AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  context?: string;
  originalError?: unknown;
}

/**
 * Create application error object
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
 * Handle and format error objects
 */
export function handleError(
  error: unknown,
  options: {
    silent?: boolean;
    context?: string;
    fallbackMessage?: string;
  } = {}
): AppError {
  const { silent = false, context, fallbackMessage = 'An unknown error occurred' } = options;

  // If already an AppError, return directly
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

  // Convert to AppError
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
 * Check if an object is an application error
 */
function isAppError(error: unknown): error is AppError {
  return (
    error instanceof Error &&
    'type' in error &&
    Object.values(ErrorType).includes((error as AppError).type)
  );
}

/**
 * Convert unknown error to application error
 */
function convertToAppError(error: unknown, fallbackMessage: string, context?: string): AppError {
  let message = fallbackMessage;
  let type = ErrorType.UNKNOWN;
  let statusCode: number | undefined;

  if (error instanceof Error) {
    message = error.message || fallbackMessage;

    // Check error type
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

    // Try to get status code
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
 * Get error message text
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
  return 'Unknown error';
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
 * Handle blockchain related errors, display friendly messages
 */
export function handleBlockchainError(error: any, operation: string = 'operation'): void {
  // Extract error message
  let errorMessage = getErrorMessage(error);

  // Handle common blockchain error types
  if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
    toast.error(`User canceled ${operation}`);
    return;
  }

  if (errorMessage.includes('insufficient funds')) {
    toast.error(`Insufficient balance, unable to complete ${operation}`);
    return;
  }

  if (errorMessage.includes('nonce')) {
    toast.error(`Transaction nonce error, please refresh the page and try again`);
    return;
  }

  if (errorMessage.includes('gas')) {
    toast.error(`Gas estimation failed, please adjust parameters and try again`);
    return;
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
    toast.error(`${operation} timed out, please check your network and try again`);
    return;
  }

  if (errorMessage.includes('network') || errorMessage.includes('Network')) {
    toast.error(`Network error, please check your connection and try again`);
    return;
  }

  // Display generic error information
  toast.error(`${operation} failed: ${errorMessage}`);
}

/**
 * Handle API errors, display friendly messages
 */
export function handleApiError(error: any, operation: string = 'request'): void {
  // Extract error message
  let errorMessage = getErrorMessage(error);
  const statusCode = error?.response?.status || error?.status;

  // Handle common HTTP status codes
  if (statusCode) {
    switch (statusCode) {
      case 400:
        toast.error(`Request parameter error: ${errorMessage}`);
        return;
      case 401:
        toast.error('You are not logged in or your login has expired, please log in again');
        // Here you can add logic to redirect to the login page
        return;
      case 403:
        toast.error('You do not have permission to perform this operation');
        return;
      case 404:
        toast.error(`Requested resource not found: ${errorMessage}`);
        return;
      case 429:
        toast.error('Request too frequent, please try again later');
        return;
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Server error, please try again later');
        return;
    }
  }

  // Network connection issue
  if (error.name === 'NetworkError' || !navigator.onLine) {
    toast.error('Network connection error, please check your network');
    return;
  }

  // Display generic error information
  toast.error(`${operation} failed: ${errorMessage}`);
}

/**
 * Error handling utility functions
 */

/**
 * Retry configuration options
 */
interface RetryOptions {
  retries?: number; // Maximum number of retries
  interval?: number; // Retry interval (milliseconds)
  shouldRetry?: (error: unknown) => boolean; // Function to determine if retry should be attempted
}

/**
 * Execute operation with retry functionality
 * @param operation Operation function to execute
 * @param options Retry configuration options
 * @returns Return value of the operation function
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions | number = 3
): Promise<T> {
  // If options is a number, it represents the number of retries
  const retryOptions: RetryOptions = typeof options === 'number' 
    ? { retries: options } 
    : options;

  const maxRetries = retryOptions.retries ?? 3;
  const interval = retryOptions.interval ?? 1000;
  const shouldRetry = retryOptions.shouldRetry ?? (() => true);

  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Stop retrying if max retries reached or shouldRetry returns false
      if (attempt >= maxRetries || !shouldRetry(error)) {
        break;
      }
      
      // Wait for specified interval before retrying
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  // All retries failed, throw the last caught error
  throw lastError;
}

/**
 * Debounce function, used to limit function call frequency
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Throttle function, used to limit function call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
