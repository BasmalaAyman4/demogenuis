  // components/checkout/CheckoutContent.tsx
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useCheckout } from '@/hooks/useCheckout';
import { useAddressManagement } from '@/hooks/useAddressManagement';
import { AddressManager } from '@/components/common/AddressManager';
import { PaymentSection } from './PaymentSection';
import { OrderSummary } from './OrderSummary';
import { CheckoutSkeleton } from './CheckoutSkeleton';

export function CheckoutContent() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'ar';
  const { session } = useSession();
  const userId = session?.user?.id;

  const {
    basicData,
    loading,
    submitting,
    selectedAddress,
    paymentType,
    selectedCard,
    anotherMobile,
    userName,
    setSelectedAddress,
    setPaymentType,
    setSelectedCard,
    setAnotherMobile,
    setUserName,
    calculations,
    cartData,
    handleCheckout,
    isAuthenticated,
    hasItems,
    error,
    retryFetch,
    refreshBasicData, // New: refresh checkout data
  } = useCheckout({ locale });

  // Address management with callback to refresh checkout data
  const addressManagement = useAddressManagement({
    locale,
    userId,
    autoFetch: true,
    onAddressChange: () => {
      // Refresh checkout data when addresses change
      refreshBasicData();
    },
  });

  // Auto-select default address when addresses are loaded
  useEffect(() => {
    if (addressManagement.addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addressManagement.defaultAddress || addressManagement.addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addressManagement.addresses, addressManagement.defaultAddress, selectedAddress, setSelectedAddress]);

  const onCheckout = async () => {
    const result = await handleCheckout();
    if (result.success) {
      router.push(`/${locale}`);
    }
  };

  if (loading) return <CheckoutSkeleton />;

  if (error && !basicData) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Checkout</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={retryFetch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push(`/${locale}/cart`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Back to Cart
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push(`/${locale}/signin?redirect=checkout`);
    return null;
  }

  if (!hasItems) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to checkout</p>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
     {locale === 'en' ? (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p className="text-gray-600">Complete your order in a few simple steps</p>
    </>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الشراء</h1>
      <p className="text-gray-600">أكمل طلبك في بضع خطوات بسيطة</p>
    </>
  )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{locale=='en'?'Contact Information':'معلومات الاتصال'}</h2>
            
            <div className="space-y-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
  {locale === 'en' ? 'Full Name' : 'الاسم بالكامل'}
  <span className="text-red-500">*</span>
</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder={`${locale=='en'?'Enter your full name':'ادخل اسمك بالكامل'}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                   {locale=='en'?'Alternative Phone Number':'رقم الهاتف البديل'}
                </label>
                <input
                  type="tel"
                  value={anotherMobile}
                  onChange={(e) => setAnotherMobile(e.target.value)}
                
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                 {locale=='en'?' We will use this if we cannot reach you on your primary number':'سوف نستخدم هذا إذا لم نتمكن من الوصول إليك على رقمك الأساسي'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Address Section */}
          <AddressManager
            mode="select"
            addresses={addressManagement.addresses}
            governorates={addressManagement.governorates}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onAdd={addressManagement.addAddress}
            onUpdate={addressManagement.updateAddress}
            loading={addressManagement.loadingAddresses}
            isSubmitting={addressManagement.submittingAddress}
            title={locale=='en'?'Delivery Address':'عنوان التسليم'}
            description={locale=='en'?"Choose where you want your order delivered":"اختر المكان الذي تريد تسليم طلبك فيه"}
            showAddButton={true}
            allowEdit={true}
            allowDelete={false}
            allowSetDefault={false}
            emptyStateMessage={locale=='en'?"No saved addresses yet":"لا توجد عناوين محفوظة حتى الآن"}
            emptyStateAction={locale=='en'?"Add Your First Address":"أضف عنوانك الأول"}
            locale={locale}
            
          />

          {/* Payment Section */}
          <PaymentSection
            paymentType={paymentType}
            onPaymentTypeChange={setPaymentType}
            visaTokens={basicData?.visaTokens || []}
            selectedCard={selectedCard}
            onSelectCard={setSelectedCard}
            locale={locale}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartData}
            calculations={calculations}
            onCheckout={onCheckout}
            isSubmitting={submitting}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}