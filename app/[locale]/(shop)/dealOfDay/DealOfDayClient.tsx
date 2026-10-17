// app/[locale]/dealOfDay/DealOfDayClient.tsx
'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pagination, PaginationInfo, ItemsPerPageSelector } from '@/components/ui/Pagination';
import { ProductsGrid } from '@/components/product/products-grid';

interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
}

interface DealOfDayClientProps {
    products: Product[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    locale: string;
}

export function DealOfDayClient({
    products,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    locale,
}: DealOfDayClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());

        startTransition(() => {
            router.push(`/${locale}/dealOfDay?${params.toString()}`, { scroll: true });
        });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('pageSize', newPageSize.toString());
        params.set('page', '1'); // Reset to first page

        startTransition(() => {
            router.push(`/${locale}/dealOfDay?${params.toString()}`);
        });
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + products.length, totalCount);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  {locale === 'en' ? (
    <>
      <h1 className="text-3xl font-bold text-gray-900">Deals of the Day</h1>
      <p className="text-gray-600 mt-1">
        Limited time offers - Don't miss out!
      </p>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-gray-900">عروض اليوم</h1>
      <p className="text-gray-600 mt-1">
        عروض لفترة محدودة - لا تفوت الفرصة!
      </p>
    </>
  )}
                </div>

                <ItemsPerPageSelector
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    options={[12, 20, 36, 48]}
                    locale={locale}

                />
            </div>

            {/* Pagination Info */}
            <PaginationInfo
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalCount}
                locale={locale}

            />

            {/* Products Grid with Loading State */}
            <div className={`relative ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
               
                <ProductsGrid
                    products={products}
                    locale={locale}

                />

                {/* Loading Overlay */}
                {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showFirstLast={true}
                        maxVisiblePages={5}
                        locale={locale}

                    />
                </div>
            )}
        </div>
    );
}