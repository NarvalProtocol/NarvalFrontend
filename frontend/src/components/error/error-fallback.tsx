'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/notification-context';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showErrorDetails?: boolean;
  showNotification?: boolean;
}

export function ErrorFallback({
  error,
  resetError,
  title = '出错了',
  message = '加载此内容时出现问题',
  showErrorDetails = false,
  showNotification = true,
}: ErrorFallbackProps) {
  const { showError } = useNotification();

  React.useEffect(() => {
    if (showNotification && error) {
      showError('组件加载失败: ' + (error.message || '未知错误'));
    }
  }, [error, showError, showNotification]);

  return (
    <div className="p-6 rounded-lg border border-red-200 bg-red-50 text-red-900 w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="mb-4">{message}</p>
      
      {showErrorDetails && error && process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 p-3 bg-red-100 rounded text-sm font-mono overflow-auto max-h-40">
          {error.message}
          {error.stack && (
            <div className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{error.stack}</div>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-3">
        {resetError && (
          <Button onClick={resetError} variant="destructive" size="sm">
            重试
          </Button>
        )}
        <Button asChild variant="outline" size="sm">
          <a href="/">返回首页</a>
        </Button>
        <Button onClick={() => window.history.back()} variant="ghost" size="sm">
          返回上一页
        </Button>
      </div>
    </div>
  );
} 