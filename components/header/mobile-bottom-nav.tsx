// components/header/mobile-bottom-nav.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface MobileBottomNavProps {
  locale: string;
}

interface NavItem {
  icon: any;
  label: string;
  href: string;
  badge?: number;
  dataAttr?: string;
}

export function MobileBottomNav({ 
  locale, 
}: MobileBottomNavProps) {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useSession();
  const { cartCount, isLoading: cartLoading } = useCart();
  const { favoritesData } = useFavorites();
  
  const navItems: NavItem[] = [
    { icon: Home, label: `${locale=='en'?'Home':'الصفحة الرئيسية'}`, href: `/${locale}` },
    { icon: Search, label: `${locale=='en'?'Search':'بحث'}`, href: `/${locale}/search` },
    { icon: Heart, label: `${locale=='en'?'Wishlist':'المفضلة'}`, href: `/${locale}/wishlist`, badge: favoritesData.length },
    { icon: ShoppingCart, label: `${locale=='en'?'Cart':'سلة التسوق'}`, href: `/${locale}/cart`, badge: cartCount, dataAttr: 'data-cart-icon' },
    { 
      icon: User, 
      label: isAuthenticated ? `${locale=='en'?'Profile':'حسابي'}` : `${locale=='en'?'Account':'الحساب'}`, 
      href: isAuthenticated ? `/${locale}/profile` : `/${locale}/signin`
    },
  ];

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] "
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)'
      }}
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => (
          <NavButton
            key={item.label}
            item={item}
            isActive={pathname === item.href}
            loading={loading && index === 4}
          />
        ))}
      </div>
    </nav>
  );
}

function NavButton({ 
  item, 
  isActive,
  loading = false
}: { 
  item: NavItem; 
  isActive: boolean;
  loading?: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`relative flex flex-col items-center justify-center gap-1 group ${
        loading ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {/* Background Indicator */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gray-50"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* Icon Container */}
      <div className="relative">
        <div className={`p-2 rounded-xl transition-all ${
          isActive 
            ? 'bg-black text-white' 
            : 'text-gray-600 group-hover:text-black'
        } ${loading ? 'animate-pulse' : ''}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>

        {/* Badge */}
        {item.badge !== undefined && item.badge > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {item.badge > 99 ? '99+' : item.badge}
          </motion.span>
        )}
      </div>

      {/* Label */}
      <span className={`text-[10px] font-medium transition-colors relative ${
        isActive ? 'text-black' : 'text-gray-600 group-hover:text-black'
      }`}>
        {item.label}
      </span>

      {/* Active Indicator Dot */}
      {isActive && (
        <motion.div
          layoutId="activeDot"
          className="absolute bottom-0 w-1 h-1 bg-black rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}