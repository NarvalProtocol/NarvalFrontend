'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNotification } from '@/context/notification-context';

export function NotificationTest() {
  const { showSuccess, showError, showWarning, showInfo, showLoading } = useNotification();

  const handleShowSuccess = () => {
    showSuccess('Operation completed successfully!');
  };

  const handleShowError = () => {
    showError('An error occurred during the operation.');
  };

  const handleShowWarning = () => {
    showWarning('This action may have consequences.');
  };

  const handleShowInfo = () => {
    showInfo('This is an informational message.');
  };

  const handleShowLoading = () => {
    const toastId = showLoading('Processing your request...');

    // Simulate completion after 3 seconds
    setTimeout(() => {
      showSuccess('Request completed!');
    }, 3000);
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <h2 className="text-xl font-bold">Notification Test</h2>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleShowSuccess} variant="default">
          Success Message
        </Button>
        <Button onClick={handleShowError} variant="destructive">
          Error Message
        </Button>
        <Button onClick={handleShowWarning} variant="secondary">
          Warning Message
        </Button>
        <Button onClick={handleShowInfo} variant="outline">
          Info Message
        </Button>
        <Button onClick={handleShowLoading} variant="secondary">
          Loading Message
        </Button>
      </div>
    </div>
  );
}
