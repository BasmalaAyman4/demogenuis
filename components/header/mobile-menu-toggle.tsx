// components/header/mobile-menu-toggle.tsx
'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { MobileMenu } from './mobile-menu';

interface MobileMenuToggleProps {
  locale: string;
  navigation: Array<{ name: string; href: string }>;
}

export function MobileMenuToggle({ locale, navigation }: MobileMenuToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <MobileMenu
        locale={locale}
        navigation={navigation}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}