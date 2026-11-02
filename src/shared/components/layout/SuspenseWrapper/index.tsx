'use client';

import {Suspense} from 'react';

import {usePathname} from 'next/navigation';

import GlobalLoader from '@/shared/components/common/loaders/GlobalLoader';
import ErrorBoundary from '@/shared/components/layout/ErrorBoundary';
import {SuspenseWrapperProps} from '@/shared/interfaces/common';

export const SuspenseWrapper = ({
  children,
  fallback = <GlobalLoader className='h-screen' />,
}: SuspenseWrapperProps) => {
  const pathname = usePathname();

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
    </Suspense>
  );
};

export default SuspenseWrapper;
