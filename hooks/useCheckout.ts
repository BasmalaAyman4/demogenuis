
  // hooks/useCheckout.ts
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useCart } from '@/contexts/CartContext';
import { type Address } from '@/hooks/useAddressManagement';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

interface VisaToken {
  cardToken: string;
  cardNumber: string;
  cardAlias: string;
}

interface ShippingOffer {
  fromDate: string;
  toDate: string;
  offerType: number;
  orderValue: number;
  offerValue: number;
}

interface CheckoutBasicData {
  fixedDiscount: { discountValue: number; discountText: string };
  userVouchers: any[];
  points: { isApprovedPointPolicy: boolean; points: number; money: number };
  shippingOffer: ShippingOffer[];
  visaTokens: VisaToken[];
  walletValue: number;
  extraDiscountOffer: number;
}

interface UseCheckoutOptions {
  locale?: string;
}

export function useCheckout(options: UseCheckoutOptions = {}) {
  const { locale = 'ar' } = options;
  const { session, loading: sessionLoading } = useSession();
  const { cartData, refreshCart } = useCart();

  const [basicData, setBasicData] = useState<CheckoutBasicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentType, setPaymentType] = useState<1 | 2>(1);
  const [selectedCard, setSelectedCard] = useState<VisaToken | null>(null);
  const [anotherMobile, setAnotherMobile] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const userId = session?.user?.id;
  const userMobile = session?.user?.mobile || '';

  // Fetch checkout basic data (without addresses)
  const fetchBasicData = useCallback(async () => {
    if (!userId || !userMobile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/CheckOut/getCheckoutBasicData?userId=${userId}&mobile=${userMobile}`,
        locale,
        { skipCache: true }
      );

      if (response.success && response.data?.data) {
        setBasicData(response.data.data);
        setDataFetched(true);
      } else {
        const errorMsg = response.error || 'Failed to load checkout data';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      console.error('Checkout data fetch error:', err);
      const errorMsg = err?.message || 'Something went wrong while loading checkout data';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [userId, userMobile, locale]);
 
  // Initial data fetch
  useEffect(() => {
    if (!sessionLoading && userId && userMobile && !dataFetched) {
      fetchBasicData();
    }
  }, [sessionLoading, userId, userMobile, dataFetched, fetchBasicData]);

  // Reset when userId changes
  useEffect(() => {
    if (userId) {
      setDataFetched(false);
    }
  }, [userId]);

  const retryFetch = useCallback(() => {
    setDataFetched(false);
    setError(null);
    fetchBasicData();
  }, [fetchBasicData]);

  // Calculate totals with memoization
  const calculations = useMemo(() => {
    const itemsTotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = selectedAddress?.shippingValue || 0;
    const discount = basicData?.fixedDiscount?.discountValue || 0;
    
    // Check for shipping offers
    let shippingDiscount = 0;
    if (basicData?.shippingOffer) {
      const applicableOffer = basicData.shippingOffer.find(
        offer => itemsTotal >= offer.orderValue
      );
      if (applicableOffer) {
        shippingDiscount = Math.abs(applicableOffer.offerValue);
      }
    }

    const finalShipping = Math.max(0, shippingCost - shippingDiscount);
    const total = itemsTotal + finalShipping - discount;

    return {
      itemsTotal,
      shippingCost,
      discount,
      shippingDiscount,
      finalShipping,
      total
    };
  }, [cartData, selectedAddress, basicData]);

  // Validation
  const validateCheckout = useCallback(() => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return false;
    }

    if (!userName.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    if (paymentType === 2 && !selectedCard) {
      toast.error('Please select a payment card');
      return false;
    }

    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    return true;
  }, [selectedAddress, userName, paymentType, selectedCard, cartData]);

  // Handle checkout submission
  const handleCheckout = useCallback(async () => {
    if (!validateCheckout() || !userId) {
      return { success: false, error: 'Validation failed' };
    }

    setSubmitting(true);
    setError(null);

    try {
      const checkoutData = {
        userId,
        userMobile,
        anotherMobile: anotherMobile || userMobile,
        userName: userName.trim(),
        totalPrice: calculations.total,
        orderPrice: calculations.itemsTotal,
        patmentType: paymentType,
        userAddressId: selectedAddress!.id,
        address: selectedAddress!.streetName,
        anotherAddress: selectedAddress!.adressAdditionalInfo || '',
        governorateCode: selectedAddress!.governorateCode,
        methodType: 51,
        details: cartData.map(item => ({
          itemCode: item.itemCode,
          quantity: item.quantity,
          price: item.price,
          itemColor: item.itemColor,
          itemSize: item.itemSize
        })),
        ...(paymentType === 2 && selectedCard ? {
          cardToken: selectedCard.cardToken,
          cardAlias: selectedCard.cardAlias,
        } : {})
      };

      const response = await api.post(
        '/api/CheckOut/checkoutweb',
        checkoutData,
        locale
      );

      if (response.success) {
        toast.success('Order placed successfully!');
        await refreshCart();
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.error || 'Failed to place order';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMsg = err?.message || 'Something went wrong. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSubmitting(false);
    }
  }, [
    validateCheckout,
    userId,
    userMobile,
    anotherMobile,
    userName,
    calculations,
    paymentType,
    selectedAddress,
    cartData,
    selectedCard,
    locale,
    refreshCart
  ]);

  // Reset payment when changing type
  useEffect(() => {
    if (paymentType === 1) {
      setSelectedCard(null);
    }
  }, [paymentType]);

  return {
    // State
    basicData,
    loading: loading || sessionLoading,
    submitting,
    error,
    
    // Form state
    selectedAddress,
    paymentType,
    selectedCard,
    anotherMobile,
    userName,
    
    // Setters
    setSelectedAddress,
    setPaymentType,
    setSelectedCard,
    setAnotherMobile,
    setUserName,
    
    // Computed
    calculations,
    cartData,
    
    // Actions
    handleCheckout,
    validateCheckout,
    refreshBasicData: fetchBasicData,
    retryFetch,

    // Flags
    isAuthenticated: !!userId && !sessionLoading,
    hasItems: cartData.length > 0,
  };
}