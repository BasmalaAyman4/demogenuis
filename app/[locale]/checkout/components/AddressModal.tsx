// components/checkout/AddressModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Address, Governorate } from '@/hooks/useAddressManagement';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: any) => Promise<{ success: boolean }>;
  governorates: Governorate[];
  editAddress?: Address | null;
  isSubmitting?: boolean;
}

const ADDRESS_TYPES = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Work' },
  { id: 3, name: 'Other' },
];

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  governorates,
  editAddress,
  isSubmitting = false,
}: AddressModalProps) {
  const [formData, setFormData] = useState({
    adressAlias: '',
    adressTypeId: 1,
    governorateCode: 0,
    streetName: '',
    buldingNo: 0,
    floorNo: 0,
    flatNo: 0,
    defaultFlage: false,
    adressAdditionalInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editAddress) {
      setFormData({
        adressAlias: editAddress.adressAlias,
        adressTypeId: editAddress.adressTypeId,
        governorateCode: editAddress.governorateCode,
        streetName: editAddress.streetName,
        buldingNo: editAddress.buldingNo,
        floorNo: editAddress.floorNo,
        flatNo: editAddress.flatNo,
        defaultFlage: editAddress.defaultFlage,
        adressAdditionalInfo: editAddress.adressAdditionalInfo,
      });
    } else {
      setFormData({
        adressAlias: '',
        adressTypeId: 1,
        governorateCode: 0,
        streetName: '',
        buldingNo: 0,
        floorNo: 0,
        flatNo: 0,
        defaultFlage: false,
        adressAdditionalInfo: '',
      });
    }
    setErrors({});
  }, [editAddress, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.adressAlias.trim()) {
      newErrors.adressAlias = 'Address alias is required';
    }
    if (formData.governorateCode === 0) {
      newErrors.governorateCode = 'Please select a governorate';
    }
    if (!formData.streetName.trim()) {
      newErrors.streetName = 'Street name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const selectedGov = governorates.find(g => g.code === formData.governorateCode);
    
    const result = await onSubmit({
      ...formData,
      governorateName: selectedGov?.name || '',
      shippingValue: selectedGov?.internalSalesManFees || 0,
      adressTypeName: ADDRESS_TYPES.find(t => t.id === formData.adressTypeId)?.name || 'Home',
      lat: '',
      long: '',
    });

    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {editAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Address Alias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.adressAlias}
                onChange={(e) => setFormData({ ...formData, adressAlias: e.target.value })}
                placeholder="e.g., Home, Work, Parents..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.adressAlias ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.adressAlias && (
                <p className="mt-1 text-sm text-red-600">{errors.adressAlias}</p>
              )}
            </div>

            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ADDRESS_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, adressTypeId: type.id })}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      formData.adressTypeId === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Governorate <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.governorateCode}
                onChange={(e) => setFormData({ ...formData, governorateCode: Number(e.target.value) })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.governorateCode ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value={0}>Select Governorate</option>
                {governorates.map((gov) => (
                  <option key={gov.code} value={gov.code}>
                    {gov.name} - {gov.internalSalesManFees} EGP
                  </option>
                ))}
              </select>
              {errors.governorateCode && (
                <p className="mt-1 text-sm text-red-600">{errors.governorateCode}</p>
              )}
            </div>

            {/* Street Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetName}
                onChange={(e) => setFormData({ ...formData, streetName: e.target.value })}
                placeholder="Enter street name"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.streetName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.streetName && (
                <p className="mt-1 text-sm text-red-600">{errors.streetName}</p>
              )}
            </div>

            {/* Building, Floor, Flat */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building No
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.buldingNo || ''}
                  onChange={(e) => setFormData({ ...formData, buldingNo: Number(e.target.value) })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor No
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.floorNo || ''}
                  onChange={(e) => setFormData({ ...formData, floorNo: Number(e.target.value) })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flat No
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.flatNo || ''}
                  onChange={(e) => setFormData({ ...formData, flatNo: Number(e.target.value) })}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                value={formData.adressAdditionalInfo}
                onChange={(e) => setFormData({ ...formData, adressAdditionalInfo: e.target.value })}
                placeholder="Any additional details (landmarks, special instructions...)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Default Address */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="defaultAddress"
                checked={formData.defaultFlage}
                onChange={(e) => setFormData({ ...formData, defaultFlage: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="defaultAddress" className="text-sm font-medium text-gray-700 cursor-pointer">
                Set as default address
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  editAddress ? 'Update Address' : 'Add Address'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}