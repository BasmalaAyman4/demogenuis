// hooks/useAuth.ts
'use client';

import { useState, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clearSessionCache } from './useSession';

interface UseAuthOptions {
  locale?: string;
  redirectTo?: string;
  callbackUrl?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { locale = 'ar', redirectTo, callbackUrl } = options;
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      // Show loading toast
      const toastId = toast.loading('Logging out...');

      // Sign out using NextAuth
      await signOut({
        redirect: false,
        callbackUrl: callbackUrl || `/${locale}`,
      });

      // Clear session cache immediately
      clearSessionCache();

      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        // Clear cart data
        localStorage.removeItem('cart');
        // Clear favorites/wishlist
        localStorage.removeItem('wishlist');
        localStorage.removeItem('favorites');
        // Clear any cached user data
        localStorage.removeItem('userPreferences');
        
        // Dispatch storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: null, // null means clear all
        }));
        
        // Dispatch custom logout event
        window.dispatchEvent(new CustomEvent('user:logout'));
      }

      // Dismiss loading toast and show success
      toast.dismiss(toastId);
      toast.success('Logged out successfully');

      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect to home or specified page
      const destination = redirectTo || `/${locale}`;
      router.push(destination);
      
      // Force a hard refresh to clear all state
      router.refresh();

    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [locale, redirectTo, callbackUrl, router]);

  return {
    logout,
    isLoggingOut,
  };
}