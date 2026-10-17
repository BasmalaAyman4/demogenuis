// components/profile/OrdersList.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import Image from 'next/image';

interface OrdersListProps {
  userId?: number | string;
  locale?: string;
}

export function OrdersList({ userId, locale = 'ar' }: OrdersListProps) {
  const {
    orders,
    loading,
    cancelling,
    error,
    cancelOrder,
    getStatusConfig,
    canCancelOrder,
    hasOrders,
  } = useOrders({ userId, locale, autoFetch: true });

  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);

  const toggleExpand = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleCancelClick = (orderId: number) => {
    setShowCancelModal(orderId);
  };

  const confirmCancel = async () => {
    if (showCancelModal) {
      await cancelOrder(showCancelModal);
      setShowCancelModal(null);
    }
  };

  // Translation helpers
  const t = {
    loading: locale === 'en' ? 'Loading...' : 'جاري التحميل...',
    failedToLoad: locale === 'en' ? 'Failed to Load Orders' : 'فشل تحميل الطلبات',
    noOrders: locale === 'en' ? 'No Orders Yet' : 'لا توجد طلبات بعد',
    noOrdersDesc: locale === 'en' ? "You haven't placed any orders yet" : 'لم تقم بإجراء أي طلبات بعد',
    startShopping: locale === 'en' ? 'Start Shopping' : 'ابدأ التسوق',
    order: locale === 'en' ? 'Order' : 'طلب',
    barcode: locale === 'en' ? 'Barcode' : 'الباركود',
    payment: locale === 'en' ? 'Payment' : 'الدفع',
    delivery: locale === 'en' ? 'Delivery' : 'التوصيل',
    saved: locale === 'en' ? 'Saved' : 'وفرت',
    item: locale === 'en' ? 'item' : 'منتج',
    items: locale === 'en' ? 'items' : 'منتجات',
    hideDetails: locale === 'en' ? 'Hide Details' : 'إخفاء التفاصيل',
    viewDetails: locale === 'en' ? 'View Details' : 'عرض التفاصيل',
    cancelOrder: locale === 'en' ? 'Cancel Order' : 'إلغاء الطلب',
    cancelling: locale === 'en' ? 'Cancelling...' : 'جاري الإلغاء...',
    orderItems: locale === 'en' ? 'Order Items' : 'منتجات الطلب',
    color: locale === 'en' ? 'Color' : 'اللون',
    size: locale === 'en' ? 'Size' : 'المقاس',
    qty: locale === 'en' ? 'Qty' : 'الكمية',
    each: locale === 'en' ? 'each' : 'للواحد',
    subtotal: locale === 'en' ? 'Subtotal' : 'المجموع الفرعي',
    discount: locale === 'en' ? 'Discount' : 'الخصم',
    total: locale === 'en' ? 'Total' : 'الإجمالي',
    cancelTitle: locale === 'en' ? 'Cancel Order?' : 'إلغاء الطلب؟',
    cancelMessage: locale === 'en' 
      ? 'Are you sure you want to cancel order' 
      : 'هل أنت متأكد من إلغاء الطلب رقم',
    cancelWarning: locale === 'en' 
      ? 'This action cannot be undone.' 
      : 'لا يمكن التراجع عن هذا الإجراء.',
    keepOrder: locale === 'en' ? 'Keep Order' : 'الاحتفاظ بالطلب',
    yesCancel: locale === 'en' ? 'Yes, Cancel' : 'نعم، إلغاء',
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.failedToLoad}</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!hasOrders) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noOrders}</h3>
        <p className="text-gray-600 mb-6">{t.noOrdersDesc}</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          {t.startShopping}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Orders List */}
        <AnimatePresence mode="popLayout">
          {orders.map((order, index) => {
            const isExpanded = expandedOrders.has(order.orderId);
            const statusConfig = getStatusConfig(order.orderStatusNo);
            const canCancel = canCancelOrder(order);
            const isCancelling = cancelling === order.orderId;

            return (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                          {t.order} #{order.orderId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm md:text-base font-semibold ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <span className="font-medium">{t.barcode}:</span>
                          <span className="font-mono">{order.docBarcode}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">{t.payment}:</span>
                          <span>{order.paymentTypeName}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium">{t.delivery}:</span>
                          <span>{order.governorateName} - {order.address}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-1">
                        {order.totalPrice.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}
                      </div>
                      {order.discount > 0 && (
                        <div className="text-xs sm:text-sm md:text-base text-green-600 font-medium">
                          {t.saved} {order.discount.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {order.details.length} {order.details.length > 1 ? t.items : t.item}
                      </div>
                    </div>
                  </div>

                  {/* Quick Items Preview */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                    {order.details.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                      >
                        <Image
                          src={item.productPic}
                          alt={item.itemName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/No_Image.png';
                          }}
                        />
                        {item.quantity > 1 && (
                          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-bl">
                            {item.quantity}
                          </div>
                        )}
                      </div>
                    ))}
                    {order.details.length > 4 && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">
                          +{order.details.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(order.orderId)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          {t.hideDetails}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          {t.viewDetails}
                        </>
                      )}
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => handleCancelClick(order.orderId)}
                        disabled={isCancelling}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isCancelling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t.cancelling}
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            {t.cancelOrder}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 bg-gray-50"
                    >
                      <div className="p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900 mb-4">{t.orderItems}</h4>
                        {order.details.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
                          >
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                              <Image
                                src={item.productPic}
                                alt={item.itemName}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/No_Image.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-gray-900 mb-1 truncate">
                                {item.itemName}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1 text-xs sm:text-sm md:text-base">
                                  <span>{item.colorName}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span>{item.sizeName}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-xs sm:text-sm md:text-base">{t.qty}:</span>
                                  <span>{item.quantity}</span>
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                                {item.price.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-gray-500">
                                  {(item.price / item.quantity).toFixed(2)} {t.each}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}

                        {/* Price Breakdown */}
                        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t.subtotal}</span>
                            <span className="font-medium">{order.orderPrice.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{t.discount}</span>
                              <span className="font-medium text-green-600">
                                -{order.discount.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                            <span>{t.total}</span>
                            <span className="text-blue-600">{order.totalPrice.toFixed(2)} {locale === 'en' ? 'EGP' : 'ج.م'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.cancelTitle}</h3>
                <p className="text-gray-600 mb-6">
                  {t.cancelMessage} #{showCancelModal}؟ {t.cancelWarning}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    {t.keepOrder}
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    {t.yesCancel}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}