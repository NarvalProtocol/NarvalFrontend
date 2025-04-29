'use client';

import { Toaster as SonnerToaster } from 'sonner';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        className: 'toast-body',
        classNames: {
          success: 'toast-success',
          error: 'toast-error',
          warning: 'toast-warning',
          info: 'toast-info',
          loading: 'toast-loading',
        },
      }}
      closeButton
      richColors
      {...props}
    />
  );
} 