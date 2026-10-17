// components/header/header.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { serverApi } from '@/lib/server-fetch';
import { OffersBar } from './offers-bar';
import { DynamicHeaderClient, type HeaderNavbarConfig } from './dynamic-header-client';
import { MobileBottomNav } from './mobile-bottom-nav';
import type { Locale } from '@/lib/i18n/config';

interface HeaderAnnouncementConfig {
  visible?: boolean;
  text?: string;
  background?: string;
  color?: string;
  link?: string;
}

interface PageBuilderHeaderConfig {
  order?: string[];
  announcement?: HeaderAnnouncementConfig;
  navbar?: HeaderNavbarConfig;
}

interface HeaderProps {
  locale: Locale;
  dictionary: any;
}

const defaultNavbarConfig: HeaderNavbarConfig = {
  visible: true,
  background: '#ffffff',
  color: '#3969a7',
  storeName: 'Blabla',
  logoUrl: '',
  logoWidth: 110,
  items: [
    { id: 'nav-categories', type: 'categories', visible: true, zone: 'left', link: '' },
    { id: 'nav-logo', type: 'logo', visible: true, zone: 'center', link: '' },
    { id: 'nav-search', type: 'search', visible: true, zone: 'right', link: '/search' },
    { id: 'nav-favorites', type: 'favorites', visible: true, zone: 'right', link: '/fav' },
    { id: 'nav-cart', type: 'cart', visible: true, zone: 'right', link: '/cart' },
    { id: 'nav-login', type: 'login', visible: true, zone: 'right', link: '/login' },
  ]
};

async function getPageBuilderHeader(): Promise<PageBuilderHeaderConfig | null> {
  try {
    const res = await serverApi.get('/api/PageBuilder/home', {
      revalidate: 60,
      tags: ['page-builder-home'],
    });

    if (res.success && res.data?.content) {
      const content = typeof res.data.content === 'string' 
        ? JSON.parse(res.data.content) 
        : res.data.content;
      return content.header || null;
    }
  } catch (error) {
    console.error('Failed to fetch PageBuilder header:', error);
  }
  return null;
}

export async function Header({ locale, dictionary }: HeaderProps) {
  const headerConfig = await getPageBuilderHeader();

  const navbarConfig = headerConfig?.navbar?.visible !== false 
    ? (headerConfig?.navbar || defaultNavbarConfig)
    : null;

  const announcementConfig = headerConfig?.announcement;
  const showAnnouncement = announcementConfig?.visible === true && announcementConfig?.text;

  const order = headerConfig?.order || ['navbar', 'announcement'];

  const renderAnnouncement = () => {
    if (!showAnnouncement || !announcementConfig) return null;
    return (
      <div
        key="announcement"
        style={{
          backgroundColor: announcementConfig.background || '#234d3e',
          color: announcementConfig.color || '#ffffff',
        }}
        className="text-center py-2 px-4 text-xs md:text-sm font-medium transition-colors"
      >
        <div className="container mx-auto px-4">
          {announcementConfig.link ? (
            <Link href={announcementConfig.link} className="hover:underline">
              {announcementConfig.text}
            </Link>
          ) : (
            <span>{announcementConfig.text}</span>
          )}
        </div>
      </div>
    );
  };

  const renderNavbar = () => {
    if (!navbarConfig) return null;
    return (
      <DynamicHeaderClient
        key="navbar"
        navbar={navbarConfig}
        locale={locale}
      />
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        {order.map((key) => (key === 'announcement' ? renderAnnouncement() : renderNavbar()))}
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav locale={locale} />
    </>
  );
}
