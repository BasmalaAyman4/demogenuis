
// app/[locale]/(shop)/product/[slug]/error.tsx
'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-gray-600">
            We couldn't load this product. Please try again.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors"
          >
            Go home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}