// hooks/useCart.ts
'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useSession } from '@/hooks/useSession';
import { AddToCartParams } from '@/types/cart';



interface CartItem extends AddToCartParams {
    userId: number;
}

interface UseCartReturn {
    addToCart: (params: AddToCartParams) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

export function useCart(locale: string = 'en'): UseCartReturn {
    const { session, loading } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isArabic = locale === 'ar';

    const addToCart = useCallback(async (params: AddToCartParams): Promise<boolean> => {
        

        // Validate required fields
        if (!params.itemCode || !params.itemColor) {
            toast.error(
                isArabic ? 'بيانات غير صالحة' : 'Invalid product data'
            );
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare cart item
            const cartItem: CartItem = {
                userId: session?.user.id,
                itemCode: params.itemCode,
                itemColor: params.itemColor,
                itemSize: params.itemSize ? params.itemSize : 0,
                quantity: params.quantity || 1,
                price: params.price,
            };

            if (process.env.NODE_ENV === 'development') {
                console.log('Adding to cart:', cartItem);
            }

            // Call API
            const response = await api.post(
                '/api/UserCart/addToCart',
                cartItem,
                locale,
                { timeout: 10000 }
            );

            if (response.success) {
               
                // Trigger cart count update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('cart-updated'));
                }

                return true;
            } else {
                // Handle API error
                const errorMsg = response.error || response.detail ||
                    (isArabic ? 'فشلت العملية' : 'Operation failed');

                toast.error(errorMsg, { duration: 3000 });
                setError(errorMsg);
                return false;
            }
        } catch (err: any) {
            // Network or unexpected errors
            const errorMsg = isArabic
                ? 'حدث خطأ، حاول مرة أخرى'
                : 'Something went wrong, please try again';

            toast.error(errorMsg, { duration: 3000 });
            setError(err.message || errorMsg);

            if (process.env.NODE_ENV === 'development') {
                console.error('Add to cart error:', err);
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [session, locale, isArabic]);

    return {
        addToCart,
        isLoading,
        error,
    };
}