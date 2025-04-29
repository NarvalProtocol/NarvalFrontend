import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RootLayout } from '@/components/layout/RootLayout';

export default function NotFound() {
  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - 页面未找到</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          很抱歉，您访问的页面不存在或已被移除。
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/">返回首页</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} size="lg">
            返回上一页
          </Button>
        </div>
      </div>
    </RootLayout>
  );
} 