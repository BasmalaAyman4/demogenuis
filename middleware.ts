// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = ["en", "ar"] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

const DEFAULT_LOCALE: Locale = "en";
const LOCALE_REGEX = /^\/([a-z]{2})\b/;

// Use Set for O(1) lookup
const PROTECTED_ROUTES = new Set([
    '/profile',
    '/orders',
    '/wishlist',
    '/cart',
    '/checkout'
]);

const AUTH_ROUTES = new Set(['/signin']);

// Static paths that should skip all middleware logic
const SKIP_PATHS = [
    '/_next',
    '/api/auth',
    '/api',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
];

/**
 * Security headers (computed once)
 */
const isLocal = process.env.NODE_ENV === 'development';

// Dynamic CSP based on environment
function getCSP() {
    const baseCSP = [
        "default-src 'self'",
        "connect-src 'self' https://apitest.geniussystemapi.com https://demo.geniussystemtest.com" +
        (isLocal ? " ws://localhost:3000 wss://localhost:3000 http://localhost:3000" : ""),
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "frame-ancestors 'none'"
    ];

    return baseCSP.join('; ');
}

const SECURITY_HEADERS: Record<string, string> = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': getCSP()
};

/**
 * Apply security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/**
 * Check if path should skip middleware entirely
 */
function shouldSkip(pathname: string, req: NextRequest): boolean {
    return SKIP_PATHS.some(path => pathname.startsWith(path)) ||
        pathname.includes('.') ||
        // Skip for RSC requests
        req.headers.get('RSC') === '1' ||
        req.headers.get('Next-Router-State-Tree') !== null;
}

/**
 * Check if route is protected (O(1) lookup)
 */
function isProtectedRoute(pathWithoutLocale: string): boolean {
    return Array.from(PROTECTED_ROUTES).some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );
}

/**
 * Check if route is auth route (O(1) lookup)
 */
function isAuthRoute(pathWithoutLocale: string): boolean {
    return Array.from(AUTH_ROUTES).some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );
}

/**
 * Main middleware
 */
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip middleware for static files and API routes
    if (shouldSkip(pathname, req)) {
        return NextResponse.next();
    }

    // Extract locale
    const match = pathname.match(LOCALE_REGEX);
    const locale = match?.[1] as Locale | undefined;

    // Validate locale and redirect if invalid
    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
        const url = req.nextUrl.clone();
        url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
        return addSecurityHeaders(NextResponse.redirect(url, 308));
    }

    // Get path without locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    // Check authentication only for protected/auth routes
    const needsAuth = isProtectedRoute(pathWithoutLocale) || isAuthRoute(pathWithoutLocale);

   return addSecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};