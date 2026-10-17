
// components/AddressSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { AddressModal } from './AddressModal';
import type { Address, Governorate } from '@/hooks/useAddressManagement';

interface AddressSectionProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  governorates: Governorate[];
  onAddAddress: (address: any) => Promise<{ success: boolean }>;
  isSubmitting?: boolean;
}

export function AddressSection({
  addresses,
  selectedAddress,
  onSelectAddress,
  governorates,
  onAddAddress,
  isSubmitting = false,
}: AddressSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition"
          >
            <Plus className="w-4 h-4" />
            Add New
          </motion.button>
        </div>

        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">No saved addresses yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Your First Address
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {addresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectAddress(address)}
                  className={`
                    relative p-5 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedAddress?.id === address.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio Button */}
                    <div className={`
                      mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all
                      ${selectedAddress?.id === address.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                      }
                    `}>
                      {selectedAddress?.id === address.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full rounded-full bg-white scale-50"
                        />
                      )}
                    </div>

                    {/* Address Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {address.adressAlias}
                        </h3>
                        {address.defaultFlage && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium"
                          >
                            Default
                          </motion.span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {address.adressTypeName}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-medium">{address.streetName}</p>
                        
                        {(address.buldingNo > 0 || address.floorNo > 0 || address.flatNo > 0) && (
                          <p>
                            {address.buldingNo > 0 && `Building ${address.buldingNo}`}
                            {address.floorNo > 0 && `, Floor ${address.floorNo}`}
                            {address.flatNo > 0 && `, Flat ${address.flatNo}`}
                          </p>
                        )}
                        
                        <p className="font-medium text-gray-700">{address.governorateName}</p>

                        {address.adressAdditionalInfo && (
                          <p className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            {address.adressAdditionalInfo}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Shipping:</span>
                          <span className="text-base font-bold text-blue-600">
                            {address.shippingValue > 0 ? `${address.shippingValue} EGP` : 'Free'}
                          </span>
                        </div>
                        
                        {selectedAddress?.id === address.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-1 text-blue-600 text-sm font-medium"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Selected
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onAddAddress}
        governorates={governorates}
        isSubmitting={isSubmitting}
      />
    </>
  );
}