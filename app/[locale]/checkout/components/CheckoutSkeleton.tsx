// components/checkout/CheckoutSkeleton.tsx
'use client';

import React from 'react';

export function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-9 bg-gray-200 rounded-lg w-48 mb-8" />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 border-2 border-gray-200 rounded-lg">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-32" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 border-2 border-gray-200 rounded-lg">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 bg-gray-200 rounded-full" />
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-48" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
            
            {/* Items Skeleton */}
            <div className="space-y-3 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-12" />
                      <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown Skeleton */}
            <div className="space-y-3 py-4 border-y border-gray-200">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              ))}
            </div>

            {/* Total Skeleton */}
            <div className="flex justify-between items-center py-4">
              <div className="h-6 bg-gray-200 rounded w-16" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>

            {/* Button Skeleton */}
            <div className="h-14 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}