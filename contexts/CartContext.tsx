// contexts/CartContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api-client';
import { toast } from 'sonner'; // or your toast library

interface Product {
    id: number;
    userId: number;
    itemCode: string;
    itemName: string;
    itemColor: number;
    colorName: string;
    itemSize: number;
    sizeName: string;
    quantity: number;
    productPic: string;
    price: number;
}

interface CartContextType {
    cartCount: number;
    cartData: Product[];
    isLoading: boolean;
    refreshCart: () => Promise<void>;
    removeFromCart: (itemId: number) => Promise<boolean>;
    incrementCount: () => void;
    setCount: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
    initialCount?: number;
    locale?: string;
}

export function CartProvider({ children, initialCount = 0, locale = 'ar' }: CartProviderProps) {
    const { session, loading } = useSession();
    const [cartCount, setCartCount] = useState(initialCount);
    const [cartData, setCartData] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const userId = session?.user?.id;

    // Fetch cart data
    const refreshCart = useCallback(async () => {
        if (!userId) {
            setCartCount(0);
            setCartData([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(
                `/api/UserCart/getUserCart?userId=${userId}`,
                locale,
                { skipCache: true }
            );

            if (response.success && response.data?.data) {
                const data = Array.isArray(response.data.data) ? response.data.data : [];
                setCartData(data);
                setCartCount(data.length);
            } else {
                setCartData([]);
                setCartCount(0);
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            setCartData([]);
            setCartCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [userId, locale]);

    // Remove item from cart
    const removeFromCart = useCallback(async (itemId: number): Promise<boolean> => {
        if (!userId) {
            toast.error('Please login to modify cart');
            return false;
        }

        // Optimistic update
        const previousData = [...cartData];
        const previousCount = cartCount;

        setCartData(prev => prev.filter(item => item.id !== itemId));
        setCartCount(prev => Math.max(0, prev - 1));

        try {
            const response = await api.post(
                `/api/UserCart/deleteCartItem?id=${itemId}`,
                locale
            );

            if (response.success) {
                toast.success('Item removed from cart');
                // Optionally refresh to sync with server
                // await refreshCart();
                return true;
            } else {
                // Rollback on failure
                setCartData(previousData);
                setCartCount(previousCount);
                toast.error(response.error || 'Failed to remove item');
                return false;
            }
        } catch (error) {
            // Rollback on error
            setCartData(previousData);
            setCartCount(previousCount);
            toast.error('Failed to remove item from cart');
            console.error('Remove from cart error:', error);
            return false;
        }
    }, [userId, locale, cartData, cartCount]);

    // Optimistic increment
    const incrementCount = useCallback(() => {
        setCartCount(prev => prev + 1);
    }, []);

    // Manual count setter
    const setCount = useCallback((count: number) => {
        setCartCount(Math.max(0, count));
    }, []);

    // Listen to cart update events
    useEffect(() => {
        const handleCartUpdate = () => refreshCart();
        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, [refreshCart]);

    // Initial fetch when authenticated
    useEffect(() => {
        if (userId) {
            const timer = setTimeout(() => {
                refreshCart();
            }, 100);
            return () => clearTimeout(timer);
        } else if (!userId) {
            setCartCount(0);
            setCartData([]);
        }
    }, [ userId, refreshCart]);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                cartData,
                isLoading,
                refreshCart,
                removeFromCart,
                incrementCount,
                setCount
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}