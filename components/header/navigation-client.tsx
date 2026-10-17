// components/header/navigation-client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationClientProps {
  navigation: Array<{ name: string; href: string }>;
  locale: string;
}

export function NavigationClient({ navigation, locale }: NavigationClientProps) {
  const pathname = usePathname();

  const isNavActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '/') {
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <nav className="hidden lg:flex items-center justify-center gap-8">
      {navigation.map((item) => {
        const isActive = isNavActive(item.href);
        return (
          <Link
            key={item.name}
            href={`/${locale}${item.href}`}
            className={`text-sm font-medium transition-colors relative group ${
              isActive
                ? 'text-black' 
                : 'text-gray-700 hover:text-gray-600'
            }`}
          >
            {item.name}
            {isActive && (
              <span className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gray-600" />
            )}
            <span className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        );
      })}
    </nav>
  );
}
