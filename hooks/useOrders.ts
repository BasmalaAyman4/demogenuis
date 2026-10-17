// hooks/useOrders.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export interface OrderItem {
  itemCode: string;
  itemName: string;
  quantity: number;
  price: number;
  itemColor: number;
  colorName: string;
  itemSize: number;
  sizeName: string;
  productPic: string;
}

export interface OrderRating {
  rateDate: string | null;
  orderId: number;
  rateValue: number;
  rateNotes: string | null;
}

export interface Order {
  orderId: number;
  totalPrice: number;
  orderPrice: number;
  paymentTypeName: string;
  paymentType: number;
  cancel: number;
  discount: number;
  address: string;
  governorateCode: number;
  governorateName: string;
  orderStatus: string;
  orderStatusNo: number;
  isRefund: boolean;
  docBarcode: string;
  details: OrderItem[];
  orderRating: OrderRating;
}

interface UseOrdersOptions {
  locale?: string;
  userId?: number | string;
  autoFetch?: boolean;
}

const ORDER_STATUS_CONFIG = {
  1: { label: 'Placed', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  2: { label: 'Processing', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  3: { label: 'Shipped', color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  4: { label: 'Delivered', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  5: { label: 'Completed', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  6: { label: 'Cancelled', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  7: { label: 'System Cancelled', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
};

export function useOrders(options: UseOrdersOptions = {}) {
  const { locale = 'ar', userId, autoFetch = false } = options;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user orders
  const fetchOrders = useCallback(async () => {
    if (!userId) return [];

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(
        `/api/CheckOut/getUserOrders?userId=${userId}`,
        locale,
        { skipCache: true }
      );

      if (response.success && response.data?.data) {
        setOrders(response.data.data);
        return response.data.data;
      } else {
        const errorMsg = response.error || 'Failed to load orders';
        setError(errorMsg);
        return [];
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to load orders';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, locale]);

  // Cancel order
  const cancelOrder = useCallback(async (orderId: number) => {
    if (!userId) {
      toast.error('User ID is required');
      return { success: false };
    }

    setCancelling(orderId);
    setError(null);

    // Optimistic update
    const previousOrders = [...orders];
    setOrders(prev =>
      prev.map(order =>
        order.orderId === orderId
          ? { ...order, orderStatus: 'Cancelled', orderStatusNo: 6, cancel: 1 }
          : order
      )
    );

    try {
      const response = await api.post(
        `/api/CheckOut/cancelOrder?orderId=${orderId}`,
        {},
        locale
      );

      if (response.success && response.data?.data) {
        toast.success('Order cancelled successfully');
        // Refresh to get server state
        await fetchOrders();
        return { success: true };
      } else {
        // Revert on failure
        setOrders(previousOrders);
        const errorMsg = response.error || 'Failed to cancel order';
        setError(errorMsg);
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      // Revert on error
      setOrders(previousOrders);
      const errorMsg = err?.message || 'Failed to cancel order';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setCancelling(null);
    }
  }, [userId, locale, orders, fetchOrders]);

  // Get status config
  const getStatusConfig = useCallback((statusNo: number) => {
    return ORDER_STATUS_CONFIG[statusNo as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG[1];
  }, []);

  // Check if order can be cancelled
  const canCancelOrder = useCallback((order: Order) => {
    return order.cancel !== 1 ;
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && userId) {
      fetchOrders();
    }
  }, [autoFetch, userId, fetchOrders]);

  return {
    orders,
    loading,
    cancelling,
    error,
    fetchOrders,
    cancelOrder,
    getStatusConfig,
    canCancelOrder,
    hasOrders: orders.length > 0,
    activeOrders: orders.filter(o => o.orderStatusNo < 6).length,
    completedOrders: orders.filter(o => o.orderStatusNo === 5).length,
    cancelledOrders: orders.filter(o => o.orderStatusNo >= 6).length,
  };
}