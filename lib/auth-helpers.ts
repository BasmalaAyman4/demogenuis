// lib/auth-helpers.ts
'use server';

import { auth } from '@/auth';

/**
 * Get current session on server
 */
export async function getSession() {
    return await auth();
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
    const session = await auth();
    return session?.user || null;
}

/**
 * Get access token from session
 */
export async function getAccessToken() {
    const session = await auth();
    return session?.accessToken || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
    const session = await auth();
    return !!session?.user;
}