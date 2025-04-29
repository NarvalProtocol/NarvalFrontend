import { toast } from 'react-toastify';

/**
 * Display success notification
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * Display error notification
 */
export function showError(message: string | Error): void {
  const errorMessage = message instanceof Error ? message.message : message;
  toast.error(errorMessage);
}

/**
 * Display warning notification
 */
export function showWarning(message: string): void {
  toast.warning(message);
}

/**
 * Display info notification
 */
export function showInfo(message: string): void {
  toast.info(message);
}

/**
 * Display loading notification
 */
export function showLoading(message: string): string | number {
  return toast.loading(message);
}

/**
 * Dismiss specific notification
 */
export function dismissNotification(id: string | number): void {
  toast.dismiss(id);
}

/**
 * Dismiss all notifications
 */
export function dismissAllNotifications(): void {
  toast.dismiss();
}
