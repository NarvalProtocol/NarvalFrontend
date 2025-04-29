'use client';

import React, { createContext, useContext } from 'react';
import { toast, ToastT } from 'sonner';

// Define notification context type
type NotificationContextType = {
  showSuccess: (message: string, options?: Partial<ToastT>) => void;
  showError: (message: string | Error, options?: Partial<ToastT>) => void;
  showWarning: (message: string, options?: Partial<ToastT>) => void;
  showInfo: (message: string, options?: Partial<ToastT>) => void;
  showLoading: (message: string, options?: Partial<ToastT>) => string | number;
};

// Create notification context
const NotificationContext = createContext<NotificationContextType>({
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
  showLoading: () => '',
});

// Notification provider component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Display success notification
  const showSuccess = (message: string, options?: Partial<ToastT>) => {
    toast.success(message, options);
  };

  // Display error notification
  const showError = (message: string | Error, options?: Partial<ToastT>) => {
    const errorMessage = message instanceof Error ? message.message : message;
    toast.error(errorMessage, options);
  };

  // Display warning notification
  const showWarning = (message: string, options?: Partial<ToastT>) => {
    toast.warning(message, options);
  };

  // Display info notification
  const showInfo = (message: string, options?: Partial<ToastT>) => {
    toast.info(message, options);
  };

  // Display loading notification, returns id for updating or cancelling
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

// Create notification hook for use in components
export const useNotification = () => useContext(NotificationContext);
