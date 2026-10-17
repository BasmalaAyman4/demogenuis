  // components/common/AddressManager.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit2, Star } from 'lucide-react';
import { AddressModal } from './AddressModal';
import type { Address, Governorate } from '@/hooks/useAddressManagement';

interface AddressManagerProps {
  addresses: Address[];
  governorates: Governorate[];
  onAdd: (address: any) => Promise<{ success: boolean }>;
  onUpdate?: (id: number, address: any) => Promise<{ success: boolean }>;
  onDelete?: (id: number) => Promise<{ success: boolean }>;
  onSetDefault?: (id: number) => Promise<{ success: boolean }>;
  onSelectAddress?: (address: Address) => void;
  selectedAddress?: Address | null;
  loading?: boolean;
  isSubmitting?: boolean;
  mode?: 'select' | 'manage';
  title?: string;
  description?: string;
  showAddButton?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowSetDefault?: boolean;
  emptyStateMessage?: string;
  emptyStateAction?: string;
  locale:string
}

export function AddressManager({
  addresses,
  governorates,
  onAdd,
  onUpdate,
  onDelete,
  onSetDefault,
  onSelectAddress,
  selectedAddress = null,
  loading = false,
  isSubmitting = false,
  mode = 'manage',
  title = 'Delivery Address',
  description,
  showAddButton = true,
  allowEdit = true,
  allowDelete = true,
  allowSetDefault = true,
  emptyStateMessage = 'No saved addresses yet',
  emptyStateAction = 'Add Your First Address',
  locale
}: AddressManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const isSelectMode = mode === 'select';

  const handleEdit = (address: Address) => {
    if (!allowEdit || !onUpdate) return;
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (addressData: any) => {
    const result = editingAddress && onUpdate
      ? await onUpdate(editingAddress.id, addressData)
      : await onAdd(addressData);

    if (result.success) {
      handleCloseModal();
    }

    return result;
  };

  const handleAddressClick = (address: Address) => {
    if (isSelectMode && onSelectAddress) {
      onSelectAddress(address);
    }
  };

  const handleSetDefault = async (e: React.MouseEvent, address: Address) => {
    e.stopPropagation();
    if (!allowSetDefault || !onSetDefault) return;
    await onSetDefault(address.id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
            </div>
          </div>
          {showAddButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2  whitespace-nowrap px-4 py-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm md:text-base   font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition"
            >
              <Plus className="w-4 h-4" />
               {locale === 'en' ? 'Add New' : 'إضافة جديد'}

            </motion.button>
          )}
        </div>

        {/* Empty State */}
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">{emptyStateMessage}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {emptyStateAction}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {addresses.map((address, index) => {
                const isSelected = selectedAddress?.id === address.id;
                const isClickable = isSelectMode;

                return (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAddressClick(address)}
                    className={`
                      relative p-5 rounded-lg border-2 transition-all
                      ${isClickable ? 'cursor-pointer' : ''}
                      ${isSelected && isSelectMode
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      {/* Radio Button (Select Mode) */}
                      {isSelectMode && (
                        <div className={`
                          mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                          ${isSelected
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full rounded-full bg-white scale-50"
                            />
                          )}
                        </div>
                      )}

                      {/* Address Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {address.adressAlias}
                          </h3>
                          
                          {address.defaultFlage && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs rounded-full font-medium shadow-sm"
                            >
                              <Star className="w-3 h-3 fill-white" />
                               {locale === 'en' ? 'Default' : 'الافتراضي'}

                            </motion.span>
                          )}
                          
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                            {address.adressTypeName}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">{address.streetName}</p>
                          
                          {(address.buldingNo > 0 || address.floorNo > 0 || address.flatNo > 0) && (
                            <p>
                              {address.buldingNo > 0 && `Building ${address.buldingNo}`}
                              {address.floorNo > 0 && `, Floor ${address.floorNo}`}
                              {address.flatNo > 0 && `, Flat ${address.flatNo}`}
                            </p>
                          )}
                          
                          <p className="font-medium text-gray-700">{address.governorateName}</p>

                          {address.adressAdditionalInfo && (
                            <p className="text-xs text-gray-500 italic mt-2 p-3 bg-gray-50 rounded-lg">
                              {address.adressAdditionalInfo}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{locale === 'en' ? 'Shipping:' : 'الشحن:'}</span>
                            <span className="text-base font-bold text-blue-600">
                              {address.shippingValue > 0 ? `${address.shippingValue} EGP` : 'Free'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!address.defaultFlage && allowSetDefault && onSetDefault && mode === 'manage' && (
                              <button
                                onClick={(e) => handleSetDefault(e, address)}
                                disabled={isSubmitting}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                              >
                                  {locale === 'en' ? 'Set as Default' : 'تعيين كافتراضي'}
                              </button>
                            )}
                            
                            {isSelected && isSelectMode && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-blue-600 text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                  {locale === 'en' ? 'Selected' : 'تم الاختيار'}

                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Edit Button */}
                      {allowEdit && onUpdate && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(address);
                          }}
                          disabled={isSubmitting}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                        >
                          <Edit2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        governorates={governorates}
        editAddress={editingAddress}
        isSubmitting={isSubmitting}
        locale={locale}
      />
    </>
  );
}