// app/[locale]/(shop)/product/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/server-fetch';
import ProductDetailClient from './components/ProductDetailClient';
import { ProductData } from './types';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  
  const response = await serverApi.get(
    `/api/HomeV2/getItemById?ItemId=${slug}`,
    { locale, revalidate: 3600 }
  );
  if (!response.success || !response.data) {
    return { title: 'Product Not Found' };
  }

  const product: ProductData = response.data.data;

  return {
    title: `${product.itemName} | Store`,
    description: product.itemDesc || `Shop ${product.itemName} at the best price`,
    openGraph: {
      title: product.itemName,
      description: product.itemDesc,
      images: [{ url: product.mainPic }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Fetch product data on server
  const response = await serverApi.get(
    `/api/HomeV2/getItemById?ItemId=${slug}`,
    { 
      locale,
      revalidate: 300, // Revalidate every 5 minutes
      tags: [`product-${slug}`]
    }
  );

  if (!response.success || !response.data) {
    notFound();
  }

  const product: ProductData = response.data.data;

  return <ProductDetailClient product={product} locale={locale} />;
}

