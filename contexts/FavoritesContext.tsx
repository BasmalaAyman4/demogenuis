// contexts/FavoritesContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

interface FavoriteProduct {
    itemCode: string;
    itemName: string;
    itemDesc: string | null;
    originalPrice: number;
    discount: number;
    price: number;
    mainPic: string;
    mainPicAltText: string | null;
    productRate: number;
    hasDeal: boolean;
    dealPrice: number;
    productVedio: string;
    quantity: number;
}

interface FavoritesContextType {
    favorites: Set<string>;
    favoritesData: FavoriteProduct[];
    isLoading: boolean;
    isFavorite: (itemCode: string) => boolean;
    toggleFavorite: (itemCode: string) => Promise<boolean>;
    addFavorite: (itemCode: string) => Promise<boolean>;
    removeFavorite: (itemCode: string) => Promise<boolean>;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
    children: ReactNode;
    locale?: string;
}

export function FavoritesProvider({ children, locale = 'ar' }: FavoritesProviderProps) {
    const { session } = useSession();
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [favoritesData, setFavoritesData] = useState<FavoriteProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const userId = session?.user?.id;
    const isArabic = locale === 'ar';

    // Fetch favorites data
    const refreshFavorites = useCallback(async () => {
        if (!userId) {
            setFavorites(new Set());
            setFavoritesData([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(
                `/api/Home/getFavoriteProducts?UserId=${userId}`,
                locale,
                { skipCache: true }
            );
            if (response.success && response.data?.data) {
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setFavoritesData(data);

                // Create Set from itemCodes for O(1) lookup
                const favoriteSet = new Set(data.map((item: FavoriteProduct) => item.itemCode));
                setFavorites(favoriteSet);
            } else {
                setFavoritesData([]);
                setFavorites(new Set());
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
            setFavoritesData([]);
            setFavorites(new Set());
        } finally {
            setIsLoading(false);
        }
    }, [userId, locale]);

    // Check if item is favorite (O(1) lookup)
    const isFavorite = useCallback((itemCode: string): boolean => {
        return favorites.has(itemCode);
    }, [favorites]);

    // Add to favorites
    const addFavorite = useCallback(async (itemCode: string): Promise<boolean> => {
        if (!userId) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 2000,
            });
            return false;
        }

        // Optimistic update
        const previousFavorites = new Set(favorites);
        setFavorites(prev => new Set(prev).add(itemCode));

        try {
            const response = await api.post(
                `/api/Home/addProductFavorite?UserId=${userId}&ItemCode=${itemCode}`,
                {},
                locale
            );

            if (response.success) {
                toast.success(
                    isArabic ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites',
                    { duration: 2000 }
                );

                // Trigger favorites update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('favorites-updated'));
                }

                return true;
            } else {
                // Rollback on failure
                setFavorites(previousFavorites);
                toast.error(
                    response.error || (isArabic ? 'فشلت العملية' : 'Operation failed'),
                    { duration: 2000 }
                );
                return false;
            }
        } catch (error) {
            // Rollback on error
            setFavorites(previousFavorites);
            toast.error(
                isArabic ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong',
                { duration: 2000 }
            );
            console.error('Add to favorites error:', error);
            return false;
        }
    }, [userId, favorites, locale, isArabic]);

    // Remove from favorites
    const removeFavorite = useCallback(async (itemCode: string): Promise<boolean> => {
        if (!userId) {
            toast.error(isArabic ? 'يرجى تسجيل الدخول أولاً' : 'Please login first', {
                duration: 2000,
            });
            return false;
        }

        // Optimistic update
        const previousFavorites = new Set(favorites);
        const newFavorites = new Set(favorites);
        newFavorites.delete(itemCode);
        setFavorites(newFavorites);

        try {
            const response = await api.post(
                `/api/Home/removeFavorite?UserId=${userId}&ItemCode=${itemCode}`,
                {},
                locale
            );

            if (response.success) {
                toast.success(
                    isArabic ? 'تمت الإزالة من المفضلة' : 'Removed from favorites',
                    { duration: 2000 }
                );

                // Trigger favorites update event
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('favorites-updated'));
                }

                return true;
            } else {
                // Rollback on failure
                setFavorites(previousFavorites);
                toast.error(
                    response.error || (isArabic ? 'فشلت العملية' : 'Operation failed'),
                    { duration: 2000 }
                );
                return false;
            }
        } catch (error) {
            // Rollback on error
            setFavorites(previousFavorites);
            toast.error(
                isArabic ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong',
                { duration: 2000 }
            );
            console.error('Remove from favorites error:', error);
            return false;
        }
    }, [userId, favorites, locale, isArabic]);

    // Toggle favorite (add or remove)
    const toggleFavorite = useCallback(async (itemCode: string): Promise<boolean> => {
        if (isFavorite(itemCode)) {
            return await removeFavorite(itemCode);
        } else {
            return await addFavorite(itemCode);
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    // Listen to favorites update events
    useEffect(() => {
        const handleFavoritesUpdate = () => refreshFavorites();
        window.addEventListener('favorites-updated', handleFavoritesUpdate);
        return () => window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    }, [refreshFavorites]);

    // Initial fetch when authenticated
    useEffect(() => {
        if (userId) {
            const timer = setTimeout(() => {
                refreshFavorites();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setFavorites(new Set());
            setFavoritesData([]);
        }
    }, [userId, refreshFavorites]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                favoritesData,
                isLoading,
                isFavorite,
                toggleFavorite,
                addFavorite,
                removeFavorite,
                refreshFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
}