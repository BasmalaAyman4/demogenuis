// app/[locale]/checkout/page.tsx
import React, { Suspense } from 'react';
import { CheckoutContent } from './components/CheckoutContent';
import { CheckoutSkeleton } from './components/CheckoutSkeleton';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}