// app/[locale]/dealOfDay/page.tsx
import React, { Suspense } from 'react';
import { serverApi } from '@/lib/server-fetch';
import { DealOfDayClient } from './DealOfDayClient';
import { DealOfDayLoading } from './DealOfDayLoading';
import { Product } from '@/types/product';

interface PageProps {
  params: { locale: string };
  searchParams: { page?: string; pageSize?: string };
}



interface ApiResponse {
  success: boolean;
  data?: {
data?:{
      item: Product[];
      totalProductCount: number;
      pageNo: number;
      pageSize: number;
      lastPageNo: number;
}

  };
  error?: string;
}

async function getDealsOfDay(pageNo: number, pageSize: number, locale: string): Promise<ApiResponse> {
  return serverApi.get(
    `/api/HomeProductWithColor/dealsOfDayWithPagination?pageNo=${pageNo}&pageSize=${pageSize}`,
    {
      locale,
      revalidate: 300, // Revalidate every 5 minutes
      tags: ['deals-of-day'],
    }
  );
}

export default async function DealOfDayPage({ params, searchParams }: PageProps) {
  const locale = params.locale || 'ar';
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 20;

  // Fetch data on server
  const response = await getDealsOfDay(currentPage, pageSize, locale);
  if (!response.success || !response.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Failed to load deals
          </h1>
          <p className="text-gray-600">{response.error || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  const { item, totalProductCount, lastPageNo } = response.data.data;
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<DealOfDayLoading />}>
        <DealOfDayClient
          products={item}
          currentPage={currentPage}
          totalPages={lastPageNo}
          totalCount={totalProductCount}
          pageSize={pageSize}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  return {
    title: 'Deals of the Day',
    description: 'Check out our amazing daily deals and special offers',
  };
}