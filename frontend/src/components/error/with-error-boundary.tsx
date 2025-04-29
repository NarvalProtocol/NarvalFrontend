'use client';

import React, { ComponentType, ReactNode } from 'react';
import { ErrorBoundary } from './error-boundary';

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) {
  const { fallback, onError } = options;

  const displayName = Component.displayName || Component.name || 'Component';

  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}
