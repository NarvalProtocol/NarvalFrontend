'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/notification-context';
import { RootLayout } from '@/components/layout/RootLayout';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { showError } = useNotification();

  useEffect(() => {
    // 记录错误到控制台，在生产环境中可替换为日志服务
    console.error('全局错误:', error);
    
    // 显示通知给用户
    showError('发生了一个错误，我们已经记录了这个问题');
  }, [error, showError]);

  return (
    <html>
      <body>
        <RootLayout>
          <div className="container flex flex-col items-center justify-center py-24 text-center">
            <h1 className="text-4xl font-bold mb-4">出错了</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              很抱歉，应用程序遇到了一个问题。我们已经记录了这个错误，并将尽快修复。
            </p>
            <div className="flex gap-4">
              <Button onClick={() => reset()} size="lg">
                重试
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/">返回首页</a>
              </Button>
            </div>
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 p-4 bg-red-50 text-red-800 rounded-md text-left max-w-2xl overflow-auto">
                <p className="font-mono text-sm mb-2">错误信息:</p>
                <pre className="font-mono text-xs whitespace-pre-wrap">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </RootLayout>
      </body>
    </html>
  );
} 