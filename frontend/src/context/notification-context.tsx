'use client';

import React, { createContext, useContext } from 'react';
import { toast, ToastT } from 'sonner';

// 定义通知上下文的类型
type NotificationContextType = {
  showSuccess: (message: string, options?: Partial<ToastT>) => void;
  showError: (message: string | Error, options?: Partial<ToastT>) => void;
  showWarning: (message: string, options?: Partial<ToastT>) => void;
  showInfo: (message: string, options?: Partial<ToastT>) => void;
  showLoading: (message: string, options?: Partial<ToastT>) => string | number;
};

// 创建通知上下文
const NotificationContext = createContext<NotificationContextType>({
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
  showLoading: () => '',
});

// 通知提供者组件
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // 显示成功通知
  const showSuccess = (message: string, options?: Partial<ToastT>) => {
    toast.success(message, options);
  };

  // 显示错误通知
  const showError = (message: string | Error, options?: Partial<ToastT>) => {
    const errorMessage = message instanceof Error ? message.message : message;
    toast.error(errorMessage, options);
  };

  // 显示警告通知
  const showWarning = (message: string, options?: Partial<ToastT>) => {
    toast.warning(message, options);
  };

  // 显示信息通知
  const showInfo = (message: string, options?: Partial<ToastT>) => {
    toast.info(message, options);
  };

  // 显示加载通知，返回id以便更新或取消
  const showLoading = (message: string, options?: Partial<ToastT>) => {
    return toast.loading(message, options);
  };

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// 创建通知钩子以便在组件中使用
export const useNotification = () => useContext(NotificationContext); 