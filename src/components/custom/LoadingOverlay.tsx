// src/components/custom/LoadingOverlay.tsx
'use client';

import { cn } from '@/lib/utils';
import { useLoadingStore } from '@/lib/zustandStore';

export default function LoadingOverlay() {
  const loadingCounter = useLoadingStore((state) => state.loadingCounter);

  if (loadingCounter > 0) {
    return (
      <div className="absolute left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-background/90">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin text-gray-500 dark:text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn('animate-spin')}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </p>
        </div>
      </div>
    );
  }
  return null;
}
