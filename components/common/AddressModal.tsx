// components/checkout/AddressModal.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import type { Address, Governorate } from '@/hooks/useAddressManagement';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: any) => Promise<{ success: boolean }>;
  governorates: Governorate[];
  editAddress?: Address | null;
  isSubmitting?: boolean;
  locale:string
}

const ADDRESS_TYPES = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Work' },
  { id: 3, name: 'Other' },
] as const;

export function AddressModal({
  isOpen,
  onClose,
  onSubmit,
  governorates,
  editAddress,
  isSubmitting = false,
  locale
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

  // Reset form when modal opens/closes or edit address changes
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

  // ✅ Memoize validation function
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

   if (!formData.adressAlias.trim()) {
  newErrors.adressAlias =
    locale === 'en'
      ? 'Address alias is required'
      : 'اسم العنوان مطلوب';
}

if (formData.governorateCode === 0) {
  newErrors.governorateCode =
    locale === 'en'
      ? 'Please select a governorate'
      : 'يرجى اختيار المحافظة';
}

if (!formData.streetName.trim()) {
  newErrors.streetName =
    locale === 'en'
      ? 'Street name is required'
      : 'اسم الشارع مطلوب';
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.adressAlias, formData.governorateCode, formData.streetName]);

  // ✅ Memoize selected governorate
  const selectedGovernorate = useMemo(() => {
    return governorates.find(g => g.code === formData.governorateCode);
  }, [governorates, formData.governorateCode]);

  // ✅ Optimized field change handlers
  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // ✅ Optimized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const addressTypeName = ADDRESS_TYPES.find(t => t.id === formData.adressTypeId)?.name || 'Home';

    const result = await onSubmit({
      ...formData,
      governorateName: selectedGovernorate?.name || '',
      shippingValue: selectedGovernorate?.internalSalesManFees || 0,
      adressTypeName: addressTypeName,
      lat: '',
      long: '',
    });

    if (result.success) {
      onClose();
    }
  }, [validate, formData, selectedGovernorate, onSubmit, onClose]);

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'en'
  ? editAddress
    ? 'Edit Address'
    : 'Add New Address'
  : editAddress
    ? 'تعديل العنوان'
    : 'إضافة عنوان جديد'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition rounded-lg hover:bg-gray-100"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Address Alias */}
            <Input
              id="adressAlias"
              label=  {locale === 'en' ? 'Address Label' : 'اسم العنوان'}
              type="text"
              value={formData.adressAlias}
              onChange={(e) => handleFieldChange('adressAlias', e.target.value)}
              placeholder={locale === 'en'
    ? 'e.g., Home, Work, Parents...'
    : 'مثال: المنزل، العمل، الوالدين...'}
              error={errors.adressAlias}
              required
              disabled={isSubmitting}
            />

            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'en' ? 'Address Type' : 'نوع العنوان'}

              </label>
              <div className="grid grid-cols-3 gap-3">
                {ADDRESS_TYPES.map((type) => (
                  <motion.button
                    key={type.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFieldChange('adressTypeId', type.id)}
                    disabled={isSubmitting}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${formData.adressTypeId === type.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {type.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Governorate - Using Select Component */}
            <Select
              id="governorateCode"
              label=  {locale === 'en' ? 'Governorate' : 'المحافظة'}

              value={formData.governorateCode}
              onChange={(e) => handleFieldChange('governorateCode', Number(e.target.value))}
              error={errors.governorateCode}
              required
              disabled={isSubmitting}
            >
              <option value={0}>  {locale === 'en' ? 'Select Governorate' : 'اختر المحافظة'}</option>
              {governorates.map((gov) => (
                <option key={gov.code} value={gov.code}>
                  {gov.name} - {gov.internalSalesManFees} EGP
                </option>
              ))}
            </Select>

            {/* Street Name */}
            <Input
              id="streetName"
              label=  {locale === 'en' ? 'Street Name' : 'اسم الشارع'}
              type="text"
              value={formData.streetName}
              onChange={(e) => handleFieldChange('streetName', e.target.value)}
              placeholder={locale === 'en' ? 'Enter street name' : 'أدخل اسم الشارع'}
              error={errors.streetName}
              required
              disabled={isSubmitting}
            />

            {/* Building, Floor, Flat */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                id="buldingNo"
                label=  {locale === 'en' ? 'Building No' : 'رقم المبنى'}
                type="number"
                min="0"
                value={formData.buldingNo || ''}
                onChange={(e) => handleFieldChange('buldingNo', Number(e.target.value))}
                placeholder={locale === 'en' ? 'Optional' : 'اختياري'}
                disabled={isSubmitting}
              />
              <Input
                id="floorNo"
                label=  {locale === 'en' ? 'Floor No' : 'رقم الدور'}
                type="number"
                min="0"
                value={formData.floorNo || ''}
                onChange={(e) => handleFieldChange('floorNo', Number(e.target.value))}
                placeholder={locale === 'en' ? 'Optional' : 'اختياري'}
                disabled={isSubmitting}
              />
              <Input
                id="flatNo"
                label=  {locale === 'en' ? 'Flat No' : 'رقم الشقة'}
                type="number"
                min="0"
                value={formData.flatNo || ''}
                onChange={(e) => handleFieldChange('flatNo', Number(e.target.value))}
                placeholder={locale === 'en' ? 'Optional' : 'اختياري'}
                disabled={isSubmitting}
              />
            </div>

            {/* Additional Info */}
            <div>
              <label htmlFor="adressAdditionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                 {locale === 'en' ? 'Additional Information' : 'معلومات إضافية'}

              </label>
              <textarea
                id="adressAdditionalInfo"
                value={formData.adressAdditionalInfo}
                onChange={(e) => handleFieldChange('adressAdditionalInfo', e.target.value)}
                placeholder={locale === 'en'
    ? 'Any additional details (landmarks, special instructions...)'
    : 'أي تفاصيل إضافية (معالم قريبة، تعليمات خاصة...)'}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Default Address Checkbox */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => !isSubmitting && handleFieldChange('defaultFlage', !formData.defaultFlage)}
            >
              <input
                type="checkbox"
                id="defaultAddress"
                checked={formData.defaultFlage}
                onChange={(e) => handleFieldChange('defaultFlage', e.target.checked)}
                disabled={isSubmitting}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <label htmlFor="defaultAddress" className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
               {locale === 'en'
  ? 'Set as default address'
  : 'تعيين كعنوان افتراضي'}
              </label>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                fullWidth
              >
                {locale === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                loadingText={locale === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                disabled={isSubmitting}
                fullWidth
              >
                {locale === 'en'
  ? editAddress
    ? 'Update Address'
    : 'Add Address'
  : editAddress
    ? 'تحديث العنوان'
    : 'إضافة عنوان'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}