'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 将错误记录到错误报告服务
    console.error('组件错误:', error, errorInfo);

    // 如果提供了自定义错误处理函数，则调用它
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了回退UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认错误UI
      return (
        <div className="p-6 rounded-lg border border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-800 mb-2">出错了</h2>
          <p className="text-red-700 mb-4">
            此组件发生了错误。您可以尝试重新加载或者返回首页。
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <div className="mb-4 p-3 bg-red-100 rounded text-sm font-mono overflow-auto max-h-40 text-red-800">
              {this.state.error.toString()}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={this.resetError} variant="destructive" size="sm">
              重试
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/">返回首页</a>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 