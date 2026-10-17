// app/[locale]/dealOfDay/DealOfDayLoading.tsx
import React from 'react';

export function DealOfDayLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>

            {/* Pagination Info Skeleton */}
            <div className="h-5 w-48 bg-gray-200 rounded" />

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="aspect-square bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-6 bg-gray-200 rounded w-2/3" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-10 w-10 bg-gray-200 rounded-lg" />
                ))}
            </div>
        </div>
    );
}

// Export as default for loading.tsx
export default DealOfDayLoading;