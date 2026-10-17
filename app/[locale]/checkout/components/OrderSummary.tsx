// components/checkout/OrderSummary.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CartItem {
  id: number;
  itemName: string;
  colorName: string;
  sizeName: string;
  quantity: number;
  productPic: string;
  price: number;
}

interface Calculations {
  itemsTotal: number;
  shippingCost: number;
  discount: number;
  shippingDiscount: number;
  finalShipping: number;
  total: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  calculations: Calculations;
  onCheckout: () => void;
  isSubmitting: boolean;
  locale:string
}

export function OrderSummary({ cartItems, calculations, onCheckout, isSubmitting,locale }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky top-8"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{locale=='en'?'Order Summary':'ملخص الطلب'}</h2>

        {/* Cart Items */}
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.productPic || '/placeholder.png'}
                  alt={item.itemName}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {item.itemName}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.colorName} • {item.sizeName}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">{locale=='en'?'Qty':'الكمية'}: {item.quantity}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.price * item.quantity} EGP
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 py-4 border-y border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600"> {locale=='en'?'Subtotal':'المجموع الفرعي'}</span>
            <span className="font-medium text-gray-900">{calculations.itemsTotal.toFixed(2)} EGP</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{locale=='en'?'Shipping':'شحن'}</span>
            <span className="font-medium text-gray-900">
              {calculations.shippingCost > 0 ? `${calculations.shippingCost.toFixed(2)} EGP` : 'Free'}
            </span>
          </div>

          {calculations.shippingDiscount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between text-sm"
            >
              <span className="text-green-600"> {locale=='en'?'Shipping Discount':'خصم الشحن'}</span>
              <span className="font-medium text-green-600">-{calculations.shippingDiscount.toFixed(2)} EGP</span>
            </motion.div>
          )}

          {calculations.discount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between text-sm"
            >
              <span className="text-green-600">{locale=='en'?'Discount':'تخفيض'}</span>
              <span className="font-medium text-green-600">-{calculations.discount.toFixed(2)} EGP</span>
            </motion.div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-4">
          <span className="text-lg font-semibold text-gray-900">{locale=='en'?'Total':'المجموع'}</span>
          <motion.span
            key={calculations.total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-blue-600"
          >
            {calculations.total.toFixed(2)} EGP
          </motion.span>
        </div>

        {/* Checkout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCheckout}
          disabled={isSubmitting}
          className={`
            w-full py-4 rounded-lg font-semibold text-white transition-all
            ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }
          `}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>  {locale === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}</span>
            </div>
          ) : (
             `${locale === 'en' ? 'Place Order' : 'إتمام الطلب'}`

          )}
        </motion.button>

       
      </div>
    </motion.div>
  );
}