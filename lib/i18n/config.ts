// lib/i18n/config.ts

export const i18n = {
    defaultLocale: 'en' as const,
    locales: ['en', 'ar'] as const
};

export type Locale = typeof i18n.locales[number];

export function getLocaleFromPathname(pathname: string): Locale {
    const segments = pathname.split('/');
    const locale = segments[1] as Locale;
    return i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
}