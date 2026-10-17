// hooks/useSession.ts
'use client';

import { useEffect, useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { getSession } from '@/lib/auth-helpers';
import type { Session } from 'next-auth';

// Singleton state
let session: Session | null = null;
let loading: boolean = true;
let cacheTimestamp: number = 0;
let fetchPromise: Promise<Session | null> | null = null;
const listeners = new Set<() => void>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let lastSnapshot: { session: Session | null; loading: boolean; isAuthenticated: boolean } | null = null;

// Subscribe function for useSyncExternalStore
function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

// Notify all listeners
function notify() {
    listeners.forEach(listener => listener());
}

// Get snapshot for useSyncExternalStore

function getSnapshot() {
    const newSnapshot = {
        session,
        loading,
        isAuthenticated: !!session && !loading
    };

    // Cache snapshot to prevent infinite re-renders
    if (
        !lastSnapshot ||
        lastSnapshot.session !== newSnapshot.session ||
        lastSnapshot.loading !== newSnapshot.loading ||
        lastSnapshot.isAuthenticated !== newSnapshot.isAuthenticated
    ) {
        lastSnapshot = newSnapshot;
    }

    return lastSnapshot;
}

// Fetch session from server
async function fetchSession(force: boolean = false) {
    const now = Date.now();
    
    // Return cached session if valid and not forced
    if (!force && session && (now - cacheTimestamp) < CACHE_DURATION) {
        loading = false;
        notify();
        return session;
    }

    // Return existing fetch promise if one is in progress
    if (fetchPromise) {
        return fetchPromise;
    }

    loading = true;
    notify();

    fetchPromise = (async () => {
        try {
            const sessionData = await getSession();
            session = sessionData;
            cacheTimestamp = Date.now();
            return sessionData;
        } catch (error) {
            console.error('Failed to fetch session:', error);
            session = null;
            return null;
        } finally {
            loading = false;
            fetchPromise = null;
            notify();
        }
    })();

    return fetchPromise;
}

// Main hook
export function useSession() {
    const snapshot = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getSnapshot
    );

    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        fetchSession();

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const refreshSession = useCallback(async () => {
        if (mountedRef.current) {
            await fetchSession(true);
        }
    }, []);

    return {
        ...snapshot,
        refreshSession
    };
}

// Call this after successful login/logout for immediate update
export function updateSession(newSession: Session | null) {
    session = newSession;
    loading = false;
    cacheTimestamp = Date.now();
    notify();
    
    // Verify with server in background
    fetchSession(true);
}

// Clear cache
export function clearSessionCache() {
    session = null;
    cacheTimestamp = 0;
    loading = true;
    notify();
}

// Pre-fetch session (call this in layout or root component)
export function prefetchSession() {
    fetchSession();
}