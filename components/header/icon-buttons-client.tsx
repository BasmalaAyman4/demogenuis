 // components/header/icon-buttons-client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingCart, User, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface IconButtonsClientProps {
  locale: string;

}

interface IconButtonData {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: number;
      dataAttr?: string;

}

export function IconButtonsClient({ 
  locale, 
}: IconButtonsClientProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSession();
  const { cartCount, isLoading: cartLoading } = useCart();
  const { favoritesData } = useFavorites();

  const buttons: IconButtonData[] = [
    { icon: Search, label: `${locale=='en'?'Search':'بحث'}`, href: '/search' },
    { 
      icon: User, 
      label: isAuthenticated ? `${locale=='en'?'Profile':'حسابي'}` : `${locale=='en'?'Account':'الحساب'}`, 
      href: isAuthenticated ? '/profile' : '/signin' 
    },
    { icon: Heart, label: `${locale=='en'?'Wishlist':'المفضلة'}`, href: '/wishlist', badge: favoritesData.length },
    { icon: ShoppingCart, label: `${locale=='en'?'Cart':'سلة التسوق'}`, href: '/cart', badge: cartCount,dataAttr: 'data-cart-icon' },
  ];

  return (
    <div className="hidden md:flex items-center gap-2">
      {buttons.map((button) => (
        <IconButton
          key={button.label}
          {...button}
          locale={locale}
          pathname={pathname}
          loading={loading && button.icon === User}
        />
      ))}
    </div>
  );
}

interface IconButtonProps extends IconButtonData {
  locale: string;
  pathname: string;
  loading?: boolean;
}

function IconButton({ 
  icon: Icon, 
  label, 
  href,
  badge,
  locale,
  pathname,
  loading = false
}: IconButtonProps) {
  const fullPath = `/${locale}${href}`;
  const isActive = pathname.startsWith(fullPath);

  return (
    <Link 
      href={fullPath}
      className={`relative p-2 rounded-lg transition-all group ${
        isActive ? 'bg-gray-100' : 'hover:bg-gray-100'
      } ${loading ? 'pointer-events-none opacity-50' : ''}`}
      aria-label={label}
    >
      <Icon 
        className={`w-5 h-5 transition-colors ${
          isActive ? 'text-black' : 'text-gray-700 group-hover:text-black'
        } ${loading ? 'animate-pulse' : ''}`} 
        strokeWidth={2}
      />
      
      {badge !== undefined && badge > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        >
          {badge > 99 ? '99+' : badge}
        </motion.span>
      )}

      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </div>
    </Link>
  );
}