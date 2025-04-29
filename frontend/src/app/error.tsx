'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">Error Occurred</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Sorry, the application encountered a problem. We have logged this error and will fix it soon.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg">
          Retry
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/">Return to Home</a>
        </Button>
      </div>
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 bg-red-50 text-red-800 rounded-md text-left max-w-2xl overflow-auto">
          <p className="font-mono text-sm mb-2">Error Message:</p>
          <pre className="font-mono text-xs whitespace-pre-wrap">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  );
}
