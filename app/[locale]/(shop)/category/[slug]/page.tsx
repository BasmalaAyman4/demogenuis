// app/[locale]/(shop)/category/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/server-fetch';
import CategoryClient from './CategoryClient';

interface PageProps {
  params: {
    locale: string;
    slug: string;
  };
}

interface BasicData {
  category?: { id: number; name: string; image?: string };
  id?: number;
  name?: string;
  subCategories: Array<{ id: number; name: string; categoryId: number }>;
  colors: Array<{ id: number; name: string; hexCode?: string }>;
  sizes: Array<{ id: number; name: string }>;
  priceRange: { minPrice: number; maxPrice: number };
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const response = await serverApi.get(
    `/api/AdvancedSearch/getBasicData?categoryId=${slug}`,
    {
      locale,
      revalidate: 300,
      tags: [`category-${slug}`],
    }
  );


  if (!response.success || !response.data) {
    console.error('Failed to fetch category data');
    notFound();
  }

  // Extract data from the correct nested structure
  let basicData: BasicData;

  // The API returns data in response.data.data[0]
  if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
    const categoryData = response.data.data[0];

    // Transform the data structure
    basicData = {
      category: {
        id: categoryData.id,
        name: categoryData.name,
        image: categoryData.image,
      },
      subCategories: categoryData.subCategories || [],
      colors: categoryData.colors || [],
      sizes: categoryData.sizes || [],
      priceRange: categoryData.priceRange || { minPrice: 0, maxPrice: 1000 },
    };
  } else {
    // Fallback: try direct structure
    basicData = {
      category: response.data.category || {
        id: parseInt(slug),
        name: 'Category',
      },
      subCategories: response.data.subCategories || [],
      colors: response.data.colors || [],
      sizes: response.data.sizes || [],
      priceRange: response.data.priceRange || { minPrice: 0, maxPrice: 1000 },
    };
  }


  return (
    <CategoryClient
      basicData={basicData}
      categoryId={parseInt(slug)}
      locale={locale}
      slug={slug}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;

  if (!slug) {
    return { title: 'Category' };
  }

  try {
    const response = await serverApi.get(
      `/api/AdvancedSearch/getBasicData?categoryId=${slug}`,
      { locale, revalidate: 3600 }
    );

    if (!response.success || !response.data) {
      return { title: 'Category' };
    }

    // Extract category name from correct structure
    let categoryName = 'Category';

    if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
      categoryName = response.data.data[0].name;
    } else if (response.data.category) {
      categoryName = response.data.category.name;
    }

    return {
      title: categoryName,
      description: `Browse ${categoryName} products`,
    };
  } catch (error) {
    return { title: 'Category' };
  }
}