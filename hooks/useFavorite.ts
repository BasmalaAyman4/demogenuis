// hooks/useFavorite.ts
'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';
import { useSession } from '@/hooks/useSession';

interface UseFavoriteReturn {
    toggleFavorite: (itemCode: string, currentStatus: boolean) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
}

export function useFavorite(locale: string = 'en'): UseFavoriteReturn {
    const { session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isArabic = locale === 'ar';
    const userId = session?.user?.id;

    const toggleFavorite = useCallback(async (
        itemCode: string,
        currentStatus: boolean
    ): Promise<boolean> => {
        if (!userId) {
            toast.error(
                isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first',
                { duration: 2000 }
            );
            return false;
        }

        if (!itemCode) {
            toast.error(
                isArabic ? 'بيانات غير صالحة' : 'Invalid product data'
            );
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const endpoint = currentStatus
                ? `/api/Home/removeFavorite?UserId=${userId}&ItemCode=${itemCode}`
                : `/api/Home/addProductFavorite?UserId=${userId}&ItemCode=${itemCode}`;

            if (process.env.NODE_ENV === 'development') {
                console.log('Toggle favorite:', { itemCode, currentStatus, endpoint });
            }

            const response = await api.post(endpoint, {}, locale, { timeout: 10000 });

            if (response.success) {
                const message = currentStatus
                    ? (isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
                    : (isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites');

                toast.success(message, { duration: 2000 });

                // Trigger favorites update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('favorites-updated'));
                }

                return true;
            } else {
                const errorMsg = response.error || response.detail ||
                    (isArabic ? 'فشلت العملية' : 'Operation failed');

                toast.error(errorMsg, { duration: 2000 });
                setError(errorMsg);
                return false;
            }
        } catch (err: any) {
            const errorMsg = isArabic
                ? 'حدث خطأ، حاول مرة أخرى'
                : 'Something went wrong, please try again';

            toast.error(errorMsg, { duration: 2000 });
            setError(err.message || errorMsg);

            if (process.env.NODE_ENV === 'development') {
                console.error('Toggle favorite error:', err);
            }

            return false;
        } finally {
            setIsLoading(false);
        }
    }, [userId, locale, isArabic]);

    return {
        toggleFavorite,
        isLoading,
        error,
    };
}