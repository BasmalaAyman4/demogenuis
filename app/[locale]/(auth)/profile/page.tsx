// app/[locale]/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, User } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';
import { useAddressManagement } from '@/hooks/useAddressManagement';
import { useOrders } from '@/hooks/useOrders';
import { AddressManager } from '@/components/common/AddressManager';
import { OrdersList } from './components/OrdersList';
import { ProfileHeader } from './components/ProfileHeader';

type Tab = 'addresses' | 'orders';

export default function ProfilePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const { session, loading: sessionLoading } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('addresses');

  const userId = session?.user?.id;

  // Address management with auto-fetch
  const addressManagement = useAddressManagement({
    locale,
    userId,
    autoFetch: true,
  });

  // Orders management
  const { orders } = useOrders({
    locale,
    userId,
    autoFetch: true,
  });

  const tabs = [
    { 
      id: 'addresses' as Tab, 
      label: `${locale === 'en' ? 'My Addresses' : 'عناويني'}`, 
      icon: MapPin, 
      count: addressManagement.addresses.length 
    },
    { 
      id: 'orders' as Tab, 
      label: `${locale === 'en' ? 'My Orders' : 'طلباتي'}`, 
      icon: Package, 
      count: orders.length 
    },
  ];

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{locale === 'en' ? 'Loading profile...' : 'جاري تحميل الملف الشخصي...'}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{locale === 'en' ? 'Please Sign In' : 'يرجى تسجيل الدخول'}</h2>
          <p className="text-gray-600">{locale === 'en'
  ? 'You need to be signed in to view your profile'
  : 'يجب تسجيل الدخول لعرض ملفك الشخصي'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header with User Info and Logout */}
        <ProfileHeader 
          user={{
            name: session?.user?.name,
            email: session?.user?.email,
            mobile: session?.user?.mobile,
            image: session?.user?.image,
          }}
          locale={locale}
        />

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm mb-6"
        >
          <div className="border-b border-gray-200">
            <div className="flex gap-2 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center  whitespace-nowrap gap-2 px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base  
                      ${isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`
                        px-2 py-0.5 text-xs rounded-full font-semibold text-sm sm:text-base  
                        ${isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                        }
                      `}>
                        {tab.count}
                      </span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'addresses' && (
            <AddressManager
              mode="manage"
              addresses={addressManagement.addresses}
              governorates={addressManagement.governorates}
              onAdd={addressManagement.addAddress}
              onUpdate={addressManagement.updateAddress}
              onDelete={addressManagement.deleteAddress}
              onSetDefault={addressManagement.setDefaultAddress}
              loading={addressManagement.loadingAddresses}
              isSubmitting={addressManagement.submittingAddress}
              title={locale === 'en' ? 'My Addresses' : 'عناويني'}
              description={locale === 'en' ? 'Manage your delivery addresses' : 'إدارة عناوين التوصيل الخاصة بك'}
              showAddButton={true}
              allowEdit={true}
              allowDelete={true}
              allowSetDefault={true}
              emptyStateMessage={locale === 'en' ? 'No saved addresses yet' : 'لا توجد عناوين محفوظة بعد'}
              emptyStateAction={locale === 'en' ? 'Add Your First Address' : 'أضف عنوانك الأول'}
              locale={locale}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersList userId={userId} locale={locale} />
          )}
        </motion.div>
      </div>
    </div>
  );
}