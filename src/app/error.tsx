'use client';

import React from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Application Error</h2>
        <p className="text-xs text-slate-500">
          An unexpected error occurred while loading the Agro-Deliveries Ke. operating system.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
