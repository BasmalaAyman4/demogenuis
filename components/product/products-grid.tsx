// components/product/products-grid.tsx
'use client';

import type { Product } from '@/types/product';
import { ProductCard } from '../ui/product-card';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface ProductsGridProps {
    products: Product[];
    locale: string;
    cols?: 2 | 3 | 4 | 5;
    gap?: 4 | 6 | 8;
    priorityCount?: number;
    showViewMore?: boolean;
    viewMorePath?: string;
    viewMoreLabel?: string;
}

export function ProductsGrid({
    products,
    locale,
    cols = 4,
    gap = 6,
    priorityCount = 4,
    showViewMore = false,
    viewMorePath,
    viewMoreLabel,
}: ProductsGridProps) {
    const router = useRouter();
    
    const gridCols = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    };

    const gapClass = {
        4: 'gap-4',
        6: 'gap-6',
        8: 'gap-8',
    };

    const handleViewMore = () => {
        if (viewMorePath) {
            router.push(`/${locale}${viewMorePath}`);
        }
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">
                    {locale === 'ar' ? 'لا توجد منتجات' : 'No products found'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className={`grid ${gridCols[cols]} ${gapClass[gap]}`}>
                {products.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        locale={locale}
                        priority={index < priorityCount}
                   
                    />
                ))}
            </div>
            
            {showViewMore && viewMorePath && (
                <div className="flex justify-center">
                    <Button
                        variant="secondary"
                        onClick={handleViewMore}
                        icon={<ArrowRight size={18} />}
                    >
                        {viewMoreLabel || (locale === 'ar' ? 'عرض المزيد' : 'View More')}
                    </Button>
                </div>
            )}
        </div>
    );
}