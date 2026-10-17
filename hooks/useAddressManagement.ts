  // hooks/useAddressManagement.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export interface Address {
  id: number;
  adressAlias: string;
  adressTypeId: number;
  adressTypeName: string;
  governorateCode: number;
  governorateName: string;
  shippingValue: number;
  streetName: string;
  buldingNo: number;
  floorNo: number;
  flatNo: number;
  lat: string;
  long: string;
  defaultFlage: boolean;
  adressAdditionalInfo: string;
}

export interface Governorate {
  code: number;
  name: string;
  internalSalesManFees: number;
}

interface UseAddressManagementOptions {
  locale?: string;
  userId?: number | string;
  autoFetch?: boolean;
  onAddressChange?: () => void; // Callback when addresses change
}

export function useAddressManagement(options: UseAddressManagementOptions = {}) {
  const { locale = 'ar', userId, autoFetch = false, onAddressChange } = options;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [loadingGovernorates, setLoadingGovernorates] = useState(false);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user addresses - simplified without circular dependencies
  const fetchAddresses = useCallback(async () => {
    if (!userId) return [];

    setLoadingAddresses(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/UserAddress/getAddresses?UserId=${userId}`,
        locale,
        { skipCache: true }
      );

      if (response.success && response.data?.data) {
        setAddresses(response.data.data);
        return response.data.data;
      } else {
        const errorMsg = response.error || 'Failed to load addresses';
        setError(errorMsg);
        return [];
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load addresses';
      setError(errorMsg);
      return [];
    } finally {
      setLoadingAddresses(false);
    }
  }, [userId, locale]);

  // Fetch governorates
  const fetchGovernorates = useCallback(async () => {
    setLoadingGovernorates(true);
    setError(null);

    try {
      const response = await api.get(
        '/api/Governorate/getGovernorate',
        locale,
        { cache: 'force-cache' }
      );

      if (response.success && response.data?.data) {
        setGovernorates(response.data.data);
        return response.data.data;
      } else {
        const errorMsg = response.error || 'Failed to load governorates';
        setError(errorMsg);
        return [];
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load governorates';
      setError(errorMsg);
      return [];
    } finally {
      setLoadingGovernorates(false);
    }
  }, [locale]);

  // Add new address with optimistic update
  const addAddress = useCallback(async (addressData: Partial<Address>) => {
    if (!userId) {
      toast.error('User ID is required');
      return { success: false };
    }

    setSubmittingAddress(true);
    setError(null);

    try {
      const payload = { userId: Number(userId), ...addressData };
      const response = await api.post('/api/UserAddress/manageUserAddress', payload, locale);

      if (response.success) {
        toast.success('Address added successfully');
        
        // Refresh addresses to get latest data
        await fetchAddresses();
        onAddressChange?.();

        return { success: true, data: response.data?.data };
      } else {
        const errorMsg = response.error || 'Failed to add address';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to add address';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmittingAddress(false);
    }
  }, [userId, locale, fetchAddresses, onAddressChange]);

  // Update address with optimistic update
  const updateAddress = useCallback(async (addressId: number, addressData: Partial<Address>) => {
    if (!userId) {
      toast.error('User ID is required');
      return { success: false };
    }

    setSubmittingAddress(true);
    setError(null);

    // Optimistic update
    const previousAddresses = [...addresses];
    setAddresses(prev => 
      prev.map(addr => addr.id === addressId ? { ...addr, ...addressData } : addr)
    );

    try {
      const payload = { id: addressId, userId: Number(userId), ...addressData };
      const response = await api.post('/api/UserAddress/manageUserAddress', payload, locale);

      if (response.success) {
        toast.success('Address updated successfully');
        
        // Refresh to get server state
        await fetchAddresses();
        onAddressChange?.();

        return { success: true, data: response.data?.data };
      } else {
        // Revert on failure
        setAddresses(previousAddresses);
        const errorMsg = response.error || 'Failed to update address';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      // Revert on error
      setAddresses(previousAddresses);
      const errorMsg = err?.message || 'Failed to update address';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmittingAddress(false);
    }
  }, [userId, locale, addresses, fetchAddresses, onAddressChange]);

  // Delete address with optimistic update
  const deleteAddress = useCallback(async (addressId: number) => {
    if (!userId) {
      toast.error('User ID is required');
      return { success: false };
    }

    setSubmittingAddress(true);
    setError(null);

    // Optimistic update
    const previousAddresses = [...addresses];
    setAddresses(prev => prev.filter(addr => addr.id !== addressId));

    try {
      const response = await api.delete(`/api/UserAddress/deleteAddress?id=${addressId}`, locale);

      if (response.success) {
        toast.success('Address deleted successfully');
        onAddressChange?.();
        return { success: true };
      } else {
        // Revert on failure
        setAddresses(previousAddresses);
        const errorMsg = response.error || 'Failed to delete address';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      // Revert on error
      setAddresses(previousAddresses);
      const errorMsg = err?.message || 'Failed to delete address';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmittingAddress(false);
    }
  }, [userId, locale, addresses, onAddressChange]);

  // Set default address with optimistic update
  const setDefaultAddress = useCallback(async (addressId: number) => {
    if (!userId) {
      toast.error('User ID is required');
      return { success: false };
    }

    setSubmittingAddress(true);
    setError(null);

    // Optimistic update
    const previousAddresses = [...addresses];
    setAddresses(prev => 
      prev.map(addr => ({ ...addr, defaultFlage: addr.id === addressId }))
    );

    try {
      const response = await api.post(
        `/api/UserAddress/setDefaultAddress?Id=${addressId}`,
        {},
        locale
      );

      if (response.success) {
        toast.success('Default address updated');
        onAddressChange?.();
        return { success: true };
      } else {
        // Revert on failure
        setAddresses(previousAddresses);
        const errorMsg = response.error || 'Failed to set default address';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      // Revert on error
      setAddresses(previousAddresses);
      const errorMsg = err?.message || 'Failed to set default address';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmittingAddress(false);
    }
  }, [userId, locale, addresses, onAddressChange]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && userId) {
      fetchAddresses();
    }
  }, [autoFetch, userId, fetchAddresses]);

  useEffect(() => {
    if (autoFetch) {
      fetchGovernorates();
    }
  }, [autoFetch, fetchGovernorates]);

  return {
    addresses,
    governorates,
    loadingAddresses,
    loadingGovernorates,
    submittingAddress,
    isLoading: loadingAddresses || loadingGovernorates,
    error,
    fetchAddresses,
    fetchGovernorates,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    defaultAddress: addresses.find(addr => addr.defaultFlage) || null,
    hasAddresses: addresses.length > 0,
  };
}