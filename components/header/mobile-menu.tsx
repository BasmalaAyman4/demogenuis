// components/header/mobile-menu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  locale: string;
  navigation: Array<{ name: string; href: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ locale, navigation, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={`/${locale}${item.href}`}
                      onClick={onClose}
                      className={`flex items-center justify-between py-3 px-4 rounded-lg transition-all group ${
                        active 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <ChevronRight 
                        className={`w-5 h-5 transition-colors ${
                          active 
                            ? 'text-white' 
                            : 'text-gray-400 group-hover:text-gray-900'
                        }`} 
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-100 mt-auto">
              <p className="text-sm text-gray-500 text-center">
                Need help? Contact support
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}