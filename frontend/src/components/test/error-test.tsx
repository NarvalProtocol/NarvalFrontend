'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { withErrorBoundary } from '@/components/error/with-error-boundary';

function ErrorThrower() {
  // This will cause a render error when triggered
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a deliberately triggered error for testing');
  }

  return (
    <div className="p-4 border rounded bg-red-50">
      <h3 className="text-lg font-semibold mb-2">Error Throwing Component</h3>
      <p className="mb-3">Click the button below to trigger an error:</p>
      <Button variant="destructive" onClick={() => setShouldThrow(true)}>
        Trigger Error
      </Button>
    </div>
  );
}

// Wrap the component with error boundary
const ErrorThrowerWithBoundary = withErrorBoundary(ErrorThrower);

export function ErrorTest() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-xl font-bold mb-4">Error Boundary Testing</h2>
        <p className="mb-4">
          This component demonstrates how error boundaries work in React. When you click the
          "Trigger Error" button, an error will be thrown, but it will be caught by the error
          boundary and display a fallback UI.
        </p>
      </div>

      <ErrorThrowerWithBoundary />
    </div>
  );
}
