// components/SessionProvider.tsx
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api-client';

interface SessionProviderProps {
    children: ReactNode;
}

// Inner component that syncs session with API client
function SessionSyncProvider({ children }: { children: ReactNode }) {
const { session, loading } = useSession();
    useEffect(() => {
        if ( session?.accessToken) {
            // Set token when user is authenticated
            api.setToken(session.accessToken);

            if (process.env.NODE_ENV === 'development') {
                console.log('✅ API token synchronized with session');
            }
        } else if (!session) {
            // Clear token when user logs out or session expires
            api.clearToken();
            api.clearCache(); // Also clear cached data on logout

            if (process.env.NODE_ENV === 'development') {
                console.log('🔓 API token and cache cleared');
            }
        }
    }, [session?.accessToken]);

    return <>{children}</>;
}

export default function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider>
            <SessionSyncProvider>
                {children}
            </SessionSyncProvider>
        </NextAuthSessionProvider>
    );
}