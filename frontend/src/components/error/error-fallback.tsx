'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/50">
      <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-200">Component Error</h2>
      <p className="mb-4 text-red-700 dark:text-red-300">
        An error occurred in this component. You can try resetting or return to the home page.
      </p>
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 max-h-40 overflow-auto rounded bg-red-100 p-3 font-mono text-sm text-red-800 dark:bg-red-900/50 dark:text-red-200">
          {error.toString()}
        </div>
      )}
      <div className="flex gap-3">
        <Button onClick={resetError} variant="destructive" size="sm">
          Reset
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  );
}
