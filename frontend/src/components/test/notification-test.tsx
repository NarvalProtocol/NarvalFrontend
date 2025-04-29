'use client';

import React from 'react';
import { useNotification } from '@/context/notification-context';

export function NotificationTest() {
  const { showSuccess, showError, showWarning, showInfo, showLoading } = useNotification();

  const handleSuccessClick = () => {
    showSuccess('这是一条成功通知');
  };

  const handleErrorClick = () => {
    showError('这是一条错误通知');
  };

  const handleWarningClick = () => {
    showWarning('这是一条警告通知');
  };

  const handleInfoClick = () => {
    showInfo('这是一条信息通知');
  };

  const handleLoadingClick = () => {
    const toastId = showLoading('加载中...');
    // 3秒后自动关闭加载并显示成功
    setTimeout(() => {
      // 使用toast.dismiss(toastId)和toast.success来更新加载状态
      import('sonner').then(({ toast }) => {
        toast.dismiss(toastId);
        toast.success('加载完成!');
      });
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">通知测试</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSuccessClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          显示成功通知
        </button>
        <button
          onClick={handleErrorClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          显示错误通知
        </button>
        <button
          onClick={handleWarningClick}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          显示警告通知
        </button>
        <button
          onClick={handleInfoClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          显示信息通知
        </button>
        <button
          onClick={handleLoadingClick}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          显示加载通知
        </button>
      </div>
    </div>
  );
} 