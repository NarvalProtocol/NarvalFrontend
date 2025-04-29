'use client';

import React, { ComponentType, FC, ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';
import { ErrorFallback } from './error-fallback';
import { useNotification } from '@/context/notification-context';

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error) => void;
  title?: string;
  message?: string;
  showErrorDetails?: boolean;
}

/**
 * 高阶组件，用于将任何组件包装在错误边界中
 */
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): FC<P> {
  const {
    fallback,
    onError,
    title = '组件加载失败',
    message = '此组件加载时出现问题',
    showErrorDetails = process.env.NODE_ENV !== 'production',
  } = options;

  const WithErrorBoundary: FC<P> = (props) => {
    const { showError } = useNotification();

    const handleError = (error: Error) => {
      console.error(`ErrorBoundary捕获到错误:`, error);
      
      // 调用自定义错误处理函数（如果提供）
      if (onError) {
        onError(error);
      }
    };

    return (
      <ErrorBoundary
        onError={handleError}
        fallback={
          fallback || (
            <ErrorFallback
              title={title}
              message={message}
              showErrorDetails={showErrorDetails}
            />
          )
        }
      >
        <Component {...(props as P)} />
      </ErrorBoundary>
    );
  };

  // 设置显示名称以便于调试
  const displayName = Component.displayName || Component.name || 'Component';
  WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;

  return WithErrorBoundary;
} 