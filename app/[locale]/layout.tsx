import type { Metadata } from 'next';
import SessionProvider from '@/components/SessionProvider';
import './global.css';
import { Nunito } from 'next/font/google';
import { Noto_Sans_Arabic } from 'next/font/google';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Header } from '@/components/header/header';
import { i18n, type Locale } from '@/lib/i18n/config';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
const nunito = Nunito({
  weight: ['200', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-nunito',
  adjustFontFallback: true,
});

const noto = Noto_Sans_Arabic({
  weight: ['200', '400', '700'],
  subsets: ['arabic'], // Changed from 'latin' to 'arabic' for better Arabic support
  display: 'swap',
  preload: true,
  variable: '--font-noto',
  adjustFontFallback: true,
});


export const metadata: Metadata = {
  title: 'ENTRY - E-commerce Store',
  description: 'Modern e-commerce store with Next.js 15',
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}
export default async function RootLayout({ children, params }: LayoutProps) {

  const { locale } = await params;
const dictionary = await getDictionary(locale);
  // Determine which font class to use based on locale
  const fontClass = locale === 'ar' ? noto.variable : nunito.variable;

  return (
    <html lang={locale} className={fontClass} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body cz-shortcut-listen="true" className={fontClass}>
        <SessionProvider>
                    <CartProvider locale={locale}>
            <FavoritesProvider locale={locale}>

                  <Header locale={locale} dictionary={dictionary} />
<main className='pb-[calc(4rem+env(safe-area-inset-bottom))]'>
          {children}
</main>
          <Toaster 
          position={locale === 'ar' ? 'top-left' : 'top-right'}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          richColors
          expand={false}
          duration={3000}
        />
        </FavoritesProvider>
        </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}