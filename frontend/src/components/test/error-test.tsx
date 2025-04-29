'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorBoundary } from '@/components/error/error-boundary';
import { ErrorFallback } from '@/components/error/error-fallback';
import { withErrorBoundary } from '@/components/error/with-error-boundary';

// 故意会抛出错误的组件
function BuggyCounter() {
  const [counter, setCounter] = useState(0);

  if (counter === 3) {
    // 故意抛出错误，测试错误边界
    throw new Error('哎呀，计数器达到3时崩溃了!');
  }

  return (
    <div className="border p-4 rounded-md">
      <p className="mb-2">当前计数: {counter}</p>
      <Button onClick={() => setCounter(counter + 1)}>
        增加 (到3会崩溃)
      </Button>
    </div>
  );
}

// 使用高阶组件包装的组件
const BuggyCounterWithErrorBoundary = withErrorBoundary(BuggyCounter, {
  title: '计数器崩溃了',
  message: '这是一个演示错误边界功能的例子',
  showErrorDetails: true,
});

export function ErrorTest() {
  const [key, setKey] = useState(0);

  const resetAllComponents = () => {
    setKey(prevKey => prevKey + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-xl font-bold">错误边界测试</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* 使用直接嵌套的错误边界 */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">使用内联错误边界</h3>
          <ErrorBoundary
            key={`inline-${key}`}
            fallback={
              <div className="p-4 bg-red-50 rounded-md">
                <p className="mb-2">计数器组件崩溃了!</p>
                <Button onClick={resetAllComponents} size="sm">重置所有测试</Button>
              </div>
            }
          >
            <BuggyCounter />
          </ErrorBoundary>
        </div>

        {/* 使用自定义回退UI的错误边界 */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">使用自定义错误回退UI</h3>
          <ErrorBoundary
            key={`custom-${key}`}
            fallback={
              <ErrorFallback
                title="计数器出错"
                message="计数器组件遇到了问题并崩溃"
                resetError={resetAllComponents}
                showErrorDetails={true}
              />
            }
          >
            <BuggyCounter />
          </ErrorBoundary>
        </div>

        {/* 使用高阶组件包装的组件 */}
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold mb-3">使用高阶组件</h3>
          <div key={`hoc-${key}`}>
            <BuggyCounterWithErrorBoundary />
          </div>
          <div className="mt-3">
            <Button onClick={resetAllComponents} variant="outline" size="sm">
              重置所有测试
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 