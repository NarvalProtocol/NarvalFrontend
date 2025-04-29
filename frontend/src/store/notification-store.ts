import { create } from 'zustand';

// Define notification types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

// Define notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  autoDismiss?: boolean;
  dismissAfter?: number;
}

interface NotificationState {
  notifications: Notification[];
  
  // Add notification
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  // Remove notification
  removeNotification: (id: string) => void;
  // Clear all notifications
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      id,
      timestamp: Date.now(),
      autoDismiss: true,
      dismissAfter: 5000,
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // If auto-dismiss is enabled, set a timer
    if (newNotification.autoDismiss) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.dismissAfter);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

// Helper functions for easily adding different types of notifications
export const showNotification = {
  info: (title: string, message: string) => {
    return useNotificationStore.getState().addNotification({ type: 'info', title, message });
  },
  success: (title: string, message: string) => {
    return useNotificationStore.getState().addNotification({ type: 'success', title, message });
  },
  warning: (title: string, message: string) => {
    return useNotificationStore.getState().addNotification({ type: 'warning', title, message });
  },
  error: (title: string, message: string) => {
    return useNotificationStore.getState().addNotification({ type: 'error', title, message });
  },
}; 