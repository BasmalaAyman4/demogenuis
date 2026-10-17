// app/[locale]/(shop)/category/[slug]/CategoryClient.tsx
'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import FilterBar from './components/FilterBar';
import ProductSkeleton from './components/ProductSkeleton';
import { ProductsGrid } from '@/components/product/products-grid';
import { usePagination } from '@/hooks/usePagination';
import { Pagination, PaginationInfo, ItemsPerPageSelector } from '@/components/ui/Pagination';
import type { Product } from '@/types/product';

interface BasicData {
  category: { id: number; name: string; image?: string };
  subCategories: Array<{ id: number; name: string; categoryId: number }>;
  colors: Array<{ id: number; name: string; hexCode?: string }>;
  sizes: Array<{ id: number; name: string }>;
  priceRange: { minPrice: number; maxPrice: number };
}

interface FilterState {
  subCategoryIds: number[];
  colorIds: number[];
  sizeIds: number[];
  sortByPrice: boolean;
  maxPrice: number;
}

interface CategoryClientProps {
  basicData: BasicData;
  categoryId: number;
  locale: string;
  slug: string;
}

export default function CategoryClient({
  basicData,
  categoryId,
  locale,
}: CategoryClientProps) {
  // ✅ Store ALL products from API (fetched ONCE)
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    subCategoryIds: [],
    colorIds: [],
    sizeIds: [],
    sortByPrice: true,
    maxPrice: basicData.priceRange?.maxPrice || 1000,
  });

  // ✅ FETCH ALL PRODUCTS ONCE (on mount)
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post(
          '/api/AdvancedSearch/getFilteredProductsWithColor',
          {
            categoryId,
            subCategoryIds: [],
            colorIds: [],
            sizeIds: [],
            sortByPrice: false,
            maxPrice: 999999,
          },
          locale,
          { skipCache: false }
        );

        if (response.success && response.data) {
          let productsArray: Product[] = [];

          if (Array.isArray(response.data)) {
            productsArray = response.data;
          } else if (response.data.products && Array.isArray(response.data.products)) {
            productsArray = response.data.products;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            productsArray = response.data.data;
          }

          setAllProducts(productsArray);
        } else {
          setError(response.error || 'Failed to load products');
          setAllProducts([]);
        }
      } catch (err) {
        console.error('Fetch products error:', err);
        setError('Failed to load products');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [categoryId, locale]);

  // ✅ CLIENT-SIDE FILTERING (INSTANT!)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by subcategories
    if (filters.subCategoryIds.length > 0) {
      result = result.filter(product =>
        filters.subCategoryIds.includes(product.subCategoryCode)
      );
    }

    // Filter by colors - Check if product has any of the selected colors
    if (filters.colorIds.length > 0) {
      result = result.filter(product => {
        // product.colors is an array of ProductColor objects
        // Each ProductColor has an itemColor property (the color ID)
        return product.colors.some(color =>
          filters.colorIds.includes(color.itemColor)
        );
      });
    }

    // Filter by sizes - Check if product has any of the selected sizes
    if (filters.sizeIds.length > 0) {
      result = result.filter(product => {
        // Each product has colors array, each color has sizesCode array
        // We need to check if ANY color variant has the selected size
        return product.colors.some(color =>
          color.sizesCode.some(size =>
            filters.sizeIds.includes(size.id)
          )
        );
      });
    }

    // Filter by price
    result = result.filter(product => product.price <= filters.maxPrice);

    // Sort by price if enabled
    if (filters.sortByPrice) {
      result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [allProducts, filters]);

  // Pagination for filtered products
  const {
    currentItems,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    setItemsPerPage,
    itemsPerPage,
  } = usePagination(filteredProducts, {
    itemsPerPage: 12,
    initialPage: 1,
  });

  // ✅ Handle filter changes (instant!)
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({
      subCategoryIds: [],
      colorIds: [],
      sizeIds: [],
      sortByPrice: true,
      maxPrice: basicData.priceRange?.maxPrice || 1000,
    });
  }, [basicData.priceRange?.maxPrice]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return (
      filters.subCategoryIds.length +
      filters.colorIds.length +
      filters.sizeIds.length +
      (filters.maxPrice < (basicData.priceRange?.maxPrice || 1000) ? 1 : 0)
    );
  }, [filters, basicData.priceRange?.maxPrice]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white sticky top-0 z-40 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {basicData.category.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">
                  {loading
                    ? `${locale === 'en' ? 'Loading...' : 'تحميل...'}`
                    : `${filteredProducts.length} ${locale === 'en' ? 'product' : 'منتج'}`
                  }
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <FilterBar
        basicData={basicData}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        locale={locale}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Top Pagination Controls */}
        {!loading && filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200"
          >
            <PaginationInfo
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredProducts.length}
              locale={locale}
            />
            <ItemsPerPageSelector
              value={itemsPerPage}
              onChange={setItemsPerPage}
              options={[12, 24, 36, 48]}
              locale={locale}
            />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <ProductSkeleton count={itemsPerPage} />
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              {activeFiltersCount > 0
                ? 'Try adjusting your filters to see more results'
                : 'No products available in this category'}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          /* Products Grid */
          <>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ProductsGrid products={currentItems} locale={locale} />
            </motion.div>

            {/* Bottom Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex flex-col items-center gap-6"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  showFirstLast={true}
                  maxVisiblePages={5}
                  locale={locale}
                />
                <PaginationInfo
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredProducts.length}
                  className="text-center"
                    locale={locale}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}