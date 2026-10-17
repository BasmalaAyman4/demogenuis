// app/[locale]/page.tsx
import { Suspense } from 'react';
import { serverApi } from '@/lib/server-fetch';
import { auth } from '@/auth';
import { BannerCarousel } from '@/components/home/banner/banner-carousel';
import { CategoryCarousel } from '@/components/home/category/CategoryCarousel';
import { DealsBanner } from '@/components/home/deals-banner';
import { ProductsGrid } from '@/components/product/products-grid';
import { BestSellingProducts } from '@/components/home/BestSellingProducts';

interface PageParams {
  params: Promise<{
    locale: string;
  }>;
}

// Optimized skeleton components
function BannerSkeleton() {
  return <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />;
}

function CategoriesSkeleton() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-12 animate-pulse" />
        <div className="flex gap-6 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-56 h-56 rounded-t-[200px] bg-gray-200 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded mt-4 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DealsSkeleton() {
  return (
    <div className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="aspect-[3/4] bg-gray-800 rounded-2xl animate-pulse" />
          <div className="aspect-[3/4] bg-gray-800 rounded-2xl animate-pulse" />
          <div className="aspect-[3/4] bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function BestSellingSkeleton() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-[600px] max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-32 bg-gray-200 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Server Components
async function BannerSection({ locale }: { locale: string }) {
  const result = await serverApi.get('/api/Home/homeBanners', {
    locale,
    revalidate: 300,
    tags: ['home-banner'],
    timeout: 15000,
  });

  if (!result.success || !result.data?.data || result.data.data.length === 0) {
    return null;
  }

  return <BannerCarousel banners={result.data.data} autoPlayInterval={5000} />;
}

async function CategoriesSection({ locale }: { locale: string }) {
  const result = await serverApi.get('/api/ItemTypes', {
    locale,
    revalidate: 600,
    tags: ['categories'],
    timeout: 15000,
  });

  if (!result.success || !result.data?.data) {
    return null;
  }

  return <CategoryCarousel categories={result.data.data} locale={locale} />;
}

async function RecentlyArrived({ locale }: { locale: string }) {
  const result = await serverApi.get('/api/HomeProductWithColor/reacentlyArrive', {
    locale,
    revalidate: 300, // 5 minutes
    tags: ['recently-arrived', `recently-arrived-${locale}`],
    timeout: 15000,
  });

  if (!result.success || !result.data?.data) {
    return { products: [], error: result.error };
  }

  return <ProductsGrid
    products={result.data.data}
    locale={locale}
    cols={4}
    gap={6}
    priorityCount={4}
          showViewMore={false}
    viewMorePath="/newArrival"
  />;
}


async function BestSellingData({ locale }: { locale: string }) {
  const result = await serverApi.get('/api/HomeProductWithColor/bestSellerByCategory', {
    locale,
    revalidate: 600, // 10 minutes
    tags: ['best-sellers', `best-sellers-${locale}`],
    timeout: 15000,
  });

  if (!result.success || !result.data?.data) {
    return null;
  }

  return <BestSellingProducts categories={result.data.data} locale={locale} />;
}


export default async function HomePage({ params }: PageParams) {
  const { locale } = await params;
  const session = await auth();

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  return (
    <main className="min-h-screen ">
      {/* Hero Banner */}
      <section className="mb-8">
        <Suspense fallback={<BannerSkeleton />}>
          <BannerSection locale={locale} />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection locale={locale} />
        </Suspense>
      </section>

      {/* Deals Banner with Countdown */}
      <section className="mb-12">
        <Suspense fallback={<DealsSkeleton />}>
          <DealsBanner
            locale={locale}
            endDate={endDate.toISOString()}
          />
        </Suspense>
      </section>

      {/* New Arrivals */}
      <section className="mb-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {locale === 'ar' ? 'أحدث المنتجات' : 'New Arrivals'}
          </h2>
        </div>
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductsSkeleton />}>
            <RecentlyArrived locale={locale} />
          </Suspense>
        </div>
      </section>

       <Suspense fallback={<BestSellingSkeleton />}>
      <BestSellingData locale={locale} />
    </Suspense>
    </main>
  );
}

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;

  return {
    title: locale === 'ar' ? 'الصفحة الرئيسية - المتجر' : 'Home Page - E-commerce',
    description:
      locale === 'ar'
        ? 'تسوق أفضل المنتجات بأسعار مميزة  '
        : 'Shop the best products at great prices  ',
    openGraph: {
 title: locale === 'ar' ? 'الصفحة الرئيسية - المتجر' : 'Home Page - E-commerce',
       description:
        locale === 'ar'
          ? 'تسوق أفضل المنتجات بأسعار مميزة'
          : 'Shop the best products at great prices',
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
    },
  };
}

