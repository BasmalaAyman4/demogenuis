// components/header/header.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Menu } from 'lucide-react';
import { OffersBar } from './offers-bar';
import { LanguageSwitcher } from './language-switcher';
import { MobileMenuToggle } from './mobile-menu-toggle';
import { NavigationClient } from './navigation-client';
import { IconButtonsClient } from './icon-buttons-client';
import { MobileBottomNav } from './mobile-bottom-nav';
import type { Locale } from '@/lib/i18n/config';

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'New Arrival', href: '/newArrival' },
  { name: 'Best Seller', href: '/bestSeller' },
  { name: 'Deal Of Day', href: '/dealOfDay' },
];

export function Header({ locale, dictionary }: HeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {/* Offers Bar */}
        <Suspense fallback={<OffersBarSkeleton />}>
          <OffersBar locale={locale} />
        </Suspense>

        {/* Main Header */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                href={`/${locale}`}
                className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
              >
                <span>Logo Website</span>
              </Link>

              {/* Desktop Navigation */}
{/*               <NavigationClient navigation={navigation} locale={locale} />
 */}
              {/* Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Language Switcher */}
                <LanguageSwitcher locale={locale} />

                {/* Desktop Icons */}
                <IconButtonsClient locale={locale} />

                {/* Mobile Menu Toggle */}
{/*                 <MobileMenuToggle locale={locale} navigation={navigation} />
 */}              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav locale={locale} cartCount={0} wishlistCount={0} />
      
   
    </>
  );
}

function OffersBarSkeleton() {
  return (
    <div className="bg-gray-600 text-white">
      <div className="container mx-auto px-4 py-2.5">
        <div className="h-6 bg-white/10 rounded animate-pulse w-64 mx-auto" />
      </div>
    </div>
  );
}