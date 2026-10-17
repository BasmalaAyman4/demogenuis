'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Menu, ShoppingBag, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

const CartPage = () => {
    const pathname = usePathname(); // e.g. "/en/products/123"
  const segments = pathname.split('/').filter(Boolean); // ["en", "products", "123"]

  const locale = segments[0];
    const { cartData, isLoading, removeFromCart } = useCart();

    // Safely ensure cartData is an array
    const items = useMemo(() =>
        Array.isArray(cartData) ? cartData : [],
        [cartData]
    );

    // Calculate totals with memoization
    const { totalProducts, total } = useMemo(() => {
        const totalProducts = items.reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
            0
        );
        const total = totalProducts;

        return { totalProducts, total };
    }, [items]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
        exit: {
            opacity: 0,
            x: -100,
            transition: { duration: 0.3 },
        },
    };

    // Handle remove with loading state
    const handleRemove = async (id: number) => {
        await removeFromCart(id);
    };

    // Loading state
    if (isLoading && items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    // Empty cart state
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                

                <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                       {locale === 'en' ? (
    <>
      <h2 className="text-2xl font-light text-gray-600 mb-2">
        Your basket is empty
      </h2>
      <Link
        href={`/${locale}`}
        className="inline-block mt-4 px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
      >
        CONTINUE SHOPPING
      </Link>
    </>
  ) : (
    <>
      <h2 className="text-2xl font-light text-gray-600 mb-2">
        سلة التسوق فارغة
      </h2>
      <Link
        href={`/${locale}`}
        className="inline-block mt-4 px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors"
      >
        متابعة التسوق
      </Link>
    </>
  )}
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
          

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-light text-center mb-8 sm:mb-12 tracking-wide"
                >
  {locale === 'en' ? 'YOUR BASKET' : 'سلة التسوق الخاصة بك'}
                </motion.h1>

                {/* Desktop Table Header - Hidden on mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="hidden lg:grid grid-cols-12 gap-4 pb-4 mb-6 border-b border-gray-300 text-xs uppercase tracking-wider text-gray-600"
                >
                     {locale === 'en' ? (
    <>
      <div className="col-span-2">PRODUCT</div>
      <div className="col-span-3">DESCRIPTION</div>
      <div className="col-span-2 text-center">COLOUR</div>
      <div className="col-span-1 text-center">SIZE</div>
      <div className="col-span-2 text-center">AMOUNT</div>
      <div className="col-span-2 text-center">ACTION</div>
    </>
  ) : (
    <>
      <div className="col-span-2">المنتج</div>
      <div className="col-span-3">الوصف</div>
      <div className="col-span-2 text-center">اللون</div>
      <div className="col-span-1 text-center">المقاس</div>
      <div className="col-span-2 text-center">الكمية</div>
      <div className="col-span-2 text-center">الإجراء</div>
    </>
  )}
                </motion.div>

                {/* Cart Items */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4 sm:space-y-6 mb-8 sm:mb-12"
                >
                    <AnimatePresence mode="popLayout">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                layout
                                className="bg-white p-4 sm:p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Desktop Layout */}
                                <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                                    {/* Product Image */}
                                    <div className="col-span-2">
                                        <div className="relative w-20 h-20 bg-gray-100 rounded">
                                            {item.productPic ? (
                                                <Image
                                                    src={item.productPic}
                                                    alt={item.itemName}
                                                    width={80}
                                                    height={80}
                                                    className="object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-3">
                                        <h3 className="font-medium text-sm mb-1">{item.itemName}</h3>
                                        <p className="text-xs text-gray-500">Ref: {item.itemCode}</p>
                                    </div>

                                    {/* Color */}
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm uppercase">
                                            {item.colorName || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Size */}
                                    <div className="col-span-1 text-center">
                                        <span className="text-sm uppercase font-medium">
                                            {item.sizeName || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="col-span-2 text-center">
                                        <p className="text-lg font-light">{item.price} EGP</p>
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-gray-500">{locale=='en'?'Qty':'الكمية'}: {item.quantity}</p>
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    <div className="col-span-2 text-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleRemove(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-5 h-5 mx-auto" />
                                            <span className="text-xs uppercase tracking-wide block mt-1">
                                                 {locale=='en'?'Remove':'حذف'}
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Mobile/Tablet Layout - Stacked Rows */}
                                <div className="lg:hidden space-y-4">
                                    {/* Image and Title Row */}
                                    <div className="flex gap-4">
                                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded">
                                            {item.productPic ? (
                                                <Image
                                                    src={item.productPic}
                                                    alt={item.itemName}
                                                    width={96}
                                                    height={96}
                                                    className="object-contain rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-base mb-1">{item.itemName}</h3>
                                            <p className="text-xs text-gray-500 mb-2">Ref: {item.itemCode}</p>
                                            <p className="text-xl font-light">{item.price} EGP</p>
                                        </div>
                                    </div>

                                    {/* Details Row */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="flex gap-6 text-sm">
                                            <div>
                                                <span className="text-gray-500 block text-xs mb-1">{locale=='en'?'COLOR':'اللون'}</span>
                                                <span className="uppercase font-medium">
                                                    {item.colorName || 'N/A'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block text-xs mb-1">{locale=='en'?'SIZE':'المقاس'}</span>
                                                <span className="uppercase font-medium">
                                                    {item.sizeName || 'N/A'}
                                                </span>
                                            </div>
                                            {item.quantity > 1 && (
                                                <div>
                                                    <span className="text-gray-500 block text-xs mb-1">{locale=='en'?'QTY':'الكمية'}</span>
                                                    <span className="font-medium">{item.quantity}</span>
                                                </div>
                                            )}
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleRemove(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 flex flex-col items-center"
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                            <span className="text-xs uppercase tracking-wide mt-1">
                                                                                                {locale=='en'?'Remove':'حذف'}

                                            </span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 sm:p-8 rounded-sm shadow-sm max-w-xl ml-auto"
                >
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{locale=='en'?'Total products:':'إجمالي المنتجات:'}</span>
                            <span className="font-medium">{totalProducts.toFixed(2)} EGP</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-light"> {locale=='en'?'Total:':'الإجمالي:'}</span>
                                <span className="text-2xl font-light">{total.toFixed(2)} EGP</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={`/${locale}`}
                            className="px-6 py-3 border border-black text-black text-center text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
                        >
                             {locale=='en'?'CONTINUE SHOPPING':'متابعة التسوق'}
                        </Link>
                        <Link
                            href={`/${locale}/checkout`}
                            className="px-6 py-3 bg-black text-white text-center text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                        >
                             {locale=='en'?'CHECKOUT':'الدفع'}
                        </Link>
                    </div>
                </motion.div>
            </div>

            
        </div>
    );
};

export default CartPage;