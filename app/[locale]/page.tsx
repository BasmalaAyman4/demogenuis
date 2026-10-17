// app/[locale]/page.tsx
import { Suspense } from 'react';
import { serverApi } from '@/lib/server-fetch';
import { BannerCarousel } from '@/components/home/banner/banner-carousel';
import { CategoryCarousel } from '@/components/home/category/CategoryCarousel';
import { DealsBanner } from '@/components/home/deals-banner';
import { ProductsGrid } from '@/components/product/products-grid';
import { BestSellingProducts } from '@/components/home/BestSellingProducts';
import type { Product } from '@/types/product';

interface PageParams {
  params: Promise<{
    locale: string;
  }>;
}

interface PageBuilderSection {
  id: string;
  type: string; // 'banner' | 'category' | 'deals_of_day' | 'best_selling' | 'recently_arrived'
  visible?: boolean;
  settings?: {
    title?: string;
    layout?: string;
    background?: string;
    limit?: number;
  };
  blocks?: any[];
  dataSource?: {
    kind?: string;
    ref?: string;
  };
}

interface PageBuilderContent {
  schemaVersion?: number;
  page?: string;
  theme?: string;
  header?: any;
  sections?: PageBuilderSection[];
}

function normalizeApiEndpoint(ref: string): string {
  const clean = ref.replace(/^\/+/, '');
  return clean.startsWith('api/') ? `/${clean}` : `/api/${clean}`;
}

function normalizeProduct(p: any): Product {
  const originalPrice = Number(p.originalPrice || p.price || 0);
  const price = Number(p.price || p.dealPrice || originalPrice);
  const hasDeal = Boolean(
    p.hasDeal || 
    (typeof p.discount === 'number' && p.discount > 0) || 
    (p.dealPrice && originalPrice && p.dealPrice < originalPrice)
  );
  const dealPrice = Number(p.dealPrice || (p.discount ? originalPrice - p.discount : price));

  return {
    id: String(p.itemCode || p.docNo || p.id || Math.random()),
    itemCode: String(p.itemCode || p.docNo || p.id || ''),
    barCode: p.barCode || null,
    itemName: p.itemName || '',
    itemDesc: p.itemDesc || '',
    itemNameA: p.itemNameA || p.itemName || '',
    itemNameE: p.itemNameE || p.itemName || '',
    searchA: p.searchA || '',
    searchE: p.searchE || '',
    categoryCode: Number(p.categoryCode || p.category || 0),
    subCategoryCode: Number(p.subCategoryCode || p.subCategory || 0),
    originalPrice: originalPrice > 0 ? originalPrice : price,
    discount: Number(p.discount || 0),
    price: price,
    dealPrice: hasDeal ? dealPrice : price,
    hasDeal: hasDeal,
    mainPic: p.mainPic || (p.twoImages && p.twoImages[0]) || '',
    mainPicAltText: p.mainPicAltText || null,
    twoImages: Array.isArray(p.twoImages) && p.twoImages.length > 0 
      ? p.twoImages 
      : (p.mainPic ? [p.mainPic] : []),
    productRate: Number(p.productRate || 0),
    isFavorite: Boolean(p.isFavorite),
    isWishList: Boolean(p.isWishList),
    quantity: Number(p.quantity || 0),
    isHotColor: Boolean(p.isHotColor),
    createdDate: p.createdDate || '',
    colors: Array.isArray(p.colors) ? p.colors : [],
  };
}

// Skeletons
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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

// Dynamic Section Renderers
async function DynamicBannerSection({ section, locale }: { section: PageBuilderSection; locale: string }) {
  const endpoint = normalizeApiEndpoint(section.dataSource?.ref || '/Home/homeBanners');
  const res = await serverApi.get(endpoint, {
    locale,
    revalidate: 300,
    tags: ['home-banner'],
    timeout: 15000,
  });

  const rawList = res.data?.data || res.data || [];
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const limit = section.settings?.limit || 10;
  const banners = rawList.slice(0, limit);

  return (
    <section 
      style={{ backgroundColor: section.settings?.background || '#ffffff' }}
      className="mb-8"
    >
      <BannerCarousel banners={banners} autoPlayInterval={5000} />
    </section>
  );
}

async function DynamicCategorySection({ section, locale }: { section: PageBuilderSection; locale: string }) {
  const endpoint = normalizeApiEndpoint(section.dataSource?.ref || '/ItemTypes');
  const res = await serverApi.get(endpoint, {
    locale,
    revalidate: 600,
    tags: ['categories'],
    timeout: 15000,
  });

  const rawList = res.data?.data || res.data || [];
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const limit = section.settings?.limit || 20;
  const categories = rawList.slice(0, limit);

  return (
    <section 
      id="categories"
      style={{ backgroundColor: section.settings?.background || '#ffffff' }}
      className="mb-12"
    >
      <CategoryCarousel categories={categories} locale={locale} />
    </section>
  );
}

async function DynamicDealsSection({ section, locale }: { section: PageBuilderSection; locale: string }) {
  const isArabic = locale === 'ar';
  const layout = section.settings?.layout || 'grid';
  const title = section.settings?.title || (isArabic ? 'عروض اليوم' : 'Deals of the Day');

  if (layout === 'slider' || layout === 'banner') {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    return (
      <section 
        style={{ backgroundColor: section.settings?.background || '#ffffff' }}
        className="mb-12"
      >
        <DealsBanner locale={locale} endDate={endDate.toISOString()} />
      </section>
    );
  }

  // Grid layout: Fetch products from deals endpoint
  const endpoint = normalizeApiEndpoint(section.dataSource?.ref || '/HomeV2/DealsOfDay');
  const res = await serverApi.get(endpoint, {
    locale,
    revalidate: 300,
    tags: ['deals-of-day'],
    timeout: 15000,
  });

  const rawList = res.data?.data || res.data || [];
  if (!Array.isArray(rawList) || rawList.length === 0) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    return <DealsBanner locale={locale} endDate={endDate.toISOString()} />;
  }

  const limit = section.settings?.limit || 4;
  const products = rawList.slice(0, limit).map(normalizeProduct);

  return (
    <section 
      style={{ backgroundColor: section.settings?.background || '#ffffff' }}
      className="mb-16 py-8"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          {title}
        </h2>
        <ProductsGrid
          products={products}
          locale={locale}
          cols={4}
          gap={6}
          priorityCount={4}
          showViewMore={true}
          viewMorePath="/dealOfDay"
        />
      </div>
    </section>
  );
}

async function DynamicBestSellingSection({ section, locale }: { section: PageBuilderSection; locale: string }) {
  const isArabic = locale === 'ar';
  const title = section.settings?.title || (isArabic ? 'الأكثر مبيعاً' : 'Best Selling');
  const endpoint = normalizeApiEndpoint(section.dataSource?.ref || '/HomeV2/bestSellerWithPagination');

  const res = await serverApi.get(endpoint, {
    locale,
    revalidate: 600,
    tags: ['best-selling'],
    timeout: 15000,
  });

  // Check if data is categorised (like /HomeProductWithColor/bestSellerByCategory)
  if (Array.isArray(res.data?.data) && res.data.data[0]?.categoryId && res.data.data[0]?.item) {
    return (
      <section 
        style={{ backgroundColor: section.settings?.background || '#ffffff' }}
        className="mb-16"
      >
        <BestSellingProducts categories={res.data.data} locale={locale} />
      </section>
    );
  }

  // Standard flat products list
  const rawList = res.data?.data?.item || res.data?.item || res.data?.data || res.data || [];
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const limit = section.settings?.limit || 4;
  const products = rawList.slice(0, limit).map(normalizeProduct);

  return (
    <section 
      style={{ backgroundColor: section.settings?.background || '#ffffff' }}
      className="mb-16 py-8"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          {title}
        </h2>
        <ProductsGrid
          products={products}
          locale={locale}
          cols={4}
          gap={6}
          priorityCount={4}
          showViewMore={true}
          viewMorePath="/bestSeller"
        />
      </div>
    </section>
  );
}

async function DynamicRecentlyArrivedSection({ section, locale }: { section: PageBuilderSection; locale: string }) {
  const isArabic = locale === 'ar';
  const title = section.settings?.title || (isArabic ? 'وصل حديثاً' : 'New Arrivals');
  const endpoint = normalizeApiEndpoint(section.dataSource?.ref || '/HomeV2/reacentlyAdded');

  const res = await serverApi.get(endpoint, {
    locale,
    revalidate: 300,
    tags: ['recently-arrived'],
    timeout: 15000,
  });

  const rawList = res.data?.data || res.data || [];
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  const limit = section.settings?.limit || 4;
  const products = rawList.slice(0, limit).map(normalizeProduct);

  return (
    <section 
      style={{ backgroundColor: section.settings?.background || '#ffffff' }}
      className="mb-16 py-8"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
          {title}
        </h2>
        <ProductsGrid
          products={products}
          locale={locale}
          cols={4}
          gap={6}
          priorityCount={4}
          showViewMore={true}
          viewMorePath="/newArrival"
        />
      </div>
    </section>
  );
}

// Fallback default sections if PageBuilder API is unavailable
const defaultSections: PageBuilderSection[] = [
  {
    id: 'sec-banner',
    type: 'banner',
    visible: true,
    settings: { title: 'Banner', layout: 'slider', background: '#ffffff', limit: 4 },
    dataSource: { kind: 'api', ref: '/Home/homeBanners' }
  },
  {
    id: 'sec-categories',
    type: 'category',
    visible: true,
    settings: { title: 'Categories', layout: 'circles', background: '#ffffff', limit: 8 },
    dataSource: { kind: 'api', ref: '/ItemTypes' }
  },
  {
    id: 'sec-deals',
    type: 'deals_of_day',
    visible: true,
    settings: { title: 'Deals of the Day', layout: 'grid', background: '#ffffff', limit: 4 },
    dataSource: { kind: 'api', ref: '/HomeV2/DealsOfDay' }
  },
  {
    id: 'sec-bestseller',
    type: 'best_selling',
    visible: true,
    settings: { title: 'Best Selling', layout: 'grid', background: '#ffffff', limit: 4 },
    dataSource: { kind: 'api', ref: '/HomeV2/bestSellerWithPagination' }
  },
  {
    id: 'sec-arrived',
    type: 'recently_arrived',
    visible: true,
    settings: { title: 'Arrived', layout: 'grid', background: '#ffffff', limit: 4 },
    dataSource: { kind: 'api', ref: '/HomeV2/reacentlyAdded' }
  }
];

export default async function HomePage({ params }: PageParams) {
  const { locale } = await params;

  let sections = defaultSections;
  try {
    const res = await serverApi.get('/api/PageBuilder/home', {
      revalidate: 60,
      tags: ['page-builder-home'],
    });

    if (res.success && res.data?.content) {
      const content: PageBuilderContent = typeof res.data.content === 'string'
        ? JSON.parse(res.data.content)
        : res.data.content;

      if (Array.isArray(content.sections) && content.sections.length > 0) {
        sections = content.sections;
      }
    }
  } catch (error) {
    console.error('Failed to load PageBuilder home config:', error);
  }

  const visibleSections = sections.filter((s) => s.visible !== false);

  return (
    <main className="min-h-screen">
      {visibleSections.map((section) => {
        switch (section.type) {
          case 'banner':
            return (
              <Suspense key={section.id} fallback={<BannerSkeleton />}>
                <DynamicBannerSection section={section} locale={locale} />
              </Suspense>
            );

          case 'category':
            return (
              <Suspense key={section.id} fallback={<CategoriesSkeleton />}>
                <DynamicCategorySection section={section} locale={locale} />
              </Suspense>
            );

          case 'deals_of_day':
            return (
              <Suspense key={section.id} fallback={<DealsSkeleton />}>
                <DynamicDealsSection section={section} locale={locale} />
              </Suspense>
            );

          case 'best_selling':
            return (
              <Suspense key={section.id} fallback={<ProductsSkeleton />}>
                <DynamicBestSellingSection section={section} locale={locale} />
              </Suspense>
            );

          case 'recently_arrived':
            return (
              <Suspense key={section.id} fallback={<ProductsSkeleton />}>
                <DynamicRecentlyArrivedSection section={section} locale={locale} />
              </Suspense>
            );

          default:
            return null;
        }
      })}
    </main>
  );
}

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;

  return {
    title: locale === 'ar' ? 'الصفحة الرئيسية - متجر إلكتروني' : 'Home Page - E-commerce',
    description:
      locale === 'ar'
        ? 'تسوق أفضل المنتجات بأفضل الأسعار'
        : 'Shop the best products at great prices',
    openGraph: {
      title: locale === 'ar' ? 'الصفحة الرئيسية - متجر إلكتروني' : 'Home Page - E-commerce',
      description:
        locale === 'ar'
          ? 'تسوق أفضل المنتجات بأفضل الأسعار'
          : 'Shop the best products at great prices',
      type: 'website',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
    },
  };
}
