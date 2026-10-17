'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingCart, User, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { LanguageSwitcher } from './language-switcher';
import type { Locale } from '@/lib/i18n/config';

export interface HeaderNavItem {
    id: string;
    type: string; // 'logo' | 'categories' | 'search' | 'cart' | 'favorites' | 'login'
    visible: boolean;
    zone: 'left' | 'center' | 'right';
    link?: string;
}

export interface HeaderNavbarConfig {
    visible?: boolean;
    background?: string;
    color?: string;
    storeName?: string;
    logoUrl?: string;
    logoWidth?: number;
    categoryIds?: any;
    items?: HeaderNavItem[];
}

interface DynamicHeaderClientProps {
    navbar: HeaderNavbarConfig;
    locale: Locale;
}

export function DynamicHeaderClient({ navbar, locale }: DynamicHeaderClientProps) {
    const pathname = usePathname();
    const { isAuthenticated, loading: sessionLoading } = useSession();
    const { cartCount } = useCart();
    const { favoritesData } = useFavorites();

    const isArabic = locale === 'ar';
    const items = (navbar.items || []).filter(item => item.visible !== false);

    // Group items by zone
    const leftItems = items.filter(item => item.zone === 'left');
    const centerItems = items.filter(item => item.zone === 'center');
    const rightItems = items.filter(item => item.zone === 'right');

    const renderItem = (item: HeaderNavItem) => {
        switch (item.type) {
            case 'logo': {
                return (
                    <Link
                        key={item.id}
                        href={`/${locale}`}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        {navbar.logoUrl ? (
                            <Image
                                src={navbar.logoUrl}
                                alt={navbar.storeName || 'Store Logo'}
                                width={navbar.logoWidth || 110}
                                height={40}
                                className="object-contain max-h-10 w-auto"
                            />
                        ) : (
                            <span
                                className="text-xl md:text-2xl font-bold tracking-tight truncate"
                                style={{ color: navbar.color || '#111827' }}
                            >
                                {navbar.storeName || 'Blabla'}
                            </span>
                        )}
                    </Link>
                );
            }

            case 'categories': {
                const targetLink = item.link || `/${locale}#categories`;
                return (
                    <Link
                        key={item.id}
                        href={targetLink.startsWith('/') ? targetLink : `/${locale}${targetLink}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-black/5 transition-colors"
                        style={{ color: navbar.color || '#374151' }}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="hidden sm:inline">
                            {isArabic ? 'الأقسام' : 'Categories'}
                        </span>
                    </Link>
                );
            }

            case 'search': {
                const searchLink = item.link || '/search';
                const fullPath = searchLink.startsWith('/') && !searchLink.startsWith(`/${locale}`) 
                    ? `/${locale}${searchLink}` 
                    : searchLink;
                const isActive = pathname.startsWith(fullPath);

                return (
                    <Link
                        key={item.id}
                        href={fullPath}
                        className={`p-2 rounded-lg transition-colors hover:bg-black/5 ${isActive ? 'bg-black/10' : ''}`}
                        style={{ color: navbar.color || '#374151' }}
                        aria-label={isArabic ? 'بحث' : 'Search'}
                    >
                        <Search className="w-5 h-5" strokeWidth={2} />
                    </Link>
                );
            }

            case 'cart': {
                const cartLink = item.link || '/cart';
                const fullPath = cartLink.startsWith('/') && !cartLink.startsWith(`/${locale}`) 
                    ? `/${locale}${cartLink}` 
                    : cartLink;
                const isActive = pathname.startsWith(fullPath);

                return (
                    <Link
                        key={item.id}
                        href={fullPath}
                        className={`relative p-2 rounded-lg transition-colors hover:bg-black/5 ${isActive ? 'bg-black/10' : ''}`}
                        style={{ color: navbar.color || '#374151' }}
                        aria-label={isArabic ? 'سلة التسوق' : 'Cart'}
                        data-cart-icon
                    >
                        <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                            >
                                {cartCount > 99 ? '99+' : cartCount}
                            </motion.span>
                        )}
                    </Link>
                );
            }

            case 'favorites': {
                const favLink = item.link === '/fav' ? '/wishlist' : (item.link || '/wishlist');
                const fullPath = favLink.startsWith('/') && !favLink.startsWith(`/${locale}`) 
                    ? `/${locale}${favLink}` 
                    : favLink;
                const isActive = pathname.startsWith(fullPath);
                const favCount = favoritesData?.length || 0;

                return (
                    <Link
                        key={item.id}
                        href={fullPath}
                        className={`relative p-2 rounded-lg transition-colors hover:bg-black/5 ${isActive ? 'bg-black/10' : ''}`}
                        style={{ color: navbar.color || '#374151' }}
                        aria-label={isArabic ? 'المفضلة' : 'Wishlist'}
                    >
                        <Heart className="w-5 h-5" strokeWidth={2} />
                        {favCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                            >
                                {favCount > 99 ? '99+' : favCount}
                            </motion.span>
                        )}
                    </Link>
                );
            }

            case 'login': {
                const loginPath = isAuthenticated ? '/profile' : (item.link || '/signin');
                const fullPath = loginPath.startsWith('/') && !loginPath.startsWith(`/${locale}`) 
                    ? `/${locale}${loginPath}` 
                    : loginPath;
                const isActive = pathname.startsWith(fullPath);

                return (
                    <Link
                        key={item.id}
                        href={fullPath}
                        className={`p-2 rounded-lg transition-colors hover:bg-black/5 ${isActive ? 'bg-black/10' : ''} ${sessionLoading ? 'pointer-events-none opacity-50' : ''}`}
                        style={{ color: navbar.color || '#374151' }}
                        aria-label={isAuthenticated ? (isArabic ? 'حسابي' : 'Profile') : (isArabic ? 'تسجيل الدخول' : 'Sign In')}
                    >
                        <User className="w-5 h-5" strokeWidth={2} />
                    </Link>
                );
            }

            default:
                return null;
        }
    };

    return (
        <div
            className="border-b transition-colors"
            style={{
                backgroundColor: navbar.background || '#ffffff',
                borderColor: 'rgba(0,0,0,0.06)'
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 relative">
                    {/* Left Zone */}
                    <div className="flex items-center gap-2 md:gap-4 justify-start flex-1 min-w-0">
                        {leftItems.map(renderItem)}
                    </div>

                    {/* Center Zone */}
                    <div className="flex items-center justify-center gap-2 md:gap-4 flex-shrink-0">
                        {centerItems.map(renderItem)}
                    </div>

                    {/* Right Zone */}
                    <div className="flex items-center gap-2 md:gap-4 justify-end flex-1 min-w-0">
                        {rightItems.map(renderItem)}
                        <LanguageSwitcher locale={locale} />
                    </div>
                </div>
            </div>
        </div>
    );
}
