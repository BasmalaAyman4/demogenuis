// components/profile/LogoutButton.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LogoutButtonProps {
  locale?: string;
  variant?: 'button' | 'card' | 'menu-item';
  showConfirmation?: boolean;
}

export function LogoutButton({ 
  locale = 'ar', 
  variant = 'button',
  showConfirmation = true 
}: LogoutButtonProps) {
  const { logout, isLoggingOut } = useAuth({ locale });
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    if (showConfirmation) {
      setShowModal(true);
    } else {
      logout();
    }
  };

  const confirmLogout = () => {
    setShowModal(false);
    logout();
  };

  // Button variant
  if (variant === 'button') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{locale === 'en' ? 'Logging out...' : 'جاري تسجيل الخروج...'}</span>
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              <span>{locale === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
            </>
          )}
        </motion.button>

        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmLogout}
        />
      </>
    );
  }

  // Card variant
  if (variant === 'card') {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="w-full bg-white rounded-xl shadow-lg p-6 border-2 border-red-200 hover:border-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              {isLoggingOut ? (
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogOut className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {locale === 'en'
  ? isLoggingOut
    ? 'Logging out...'
    : 'Logout'
  : isLoggingOut
    ? 'جاري تسجيل الخروج...'
    : 'تسجيل الخروج'}
              </h3>
              <p className="text-sm text-gray-600">
                {locale === 'en' ? 'Sign out of your account' : 'تسجيل الخروج من حسابك'}
              </p>
            </div>
          </div>
        </motion.button>

        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmLogout}
        />
      </>
    );
  }

  // Menu item variant
  return (
    <>
      <motion.button
        whileHover={{ x: 4 }}
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoggingOut ? (
          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
        <span>{locale === 'en'
  ? isLoggingOut
    ? 'Logging out...'
    : 'Logout'
  : isLoggingOut
    ? 'جاري تسجيل الخروج...'
    : 'تسجيل الخروج'}</span>
      </motion.button>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmLogout}
        locale={locale}
      />
    </>
  );
}

// Confirmation Modal Component
function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm ,
  locale
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  locale:string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <AlertCircle className="w-8 h-8 text-red-600" />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
    {locale === 'en' ? 'Logout Confirmation' : 'تأكيد تسجيل الخروج'}
  </h3>

  <p className="text-gray-600 mb-6">
    {locale === 'en'
      ? "Are you sure you want to logout? You'll need to sign in again to access your account."
      : 'هل أنت متأكد أنك تريد تسجيل الخروج؟ ستحتاج لتسجيل الدخول مرة أخرى للوصول إلى حسابك.'}
  </p>

              {/* Actions */}
              <div className="flex gap-3">
  <button
    onClick={onClose}
    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
  >
    {locale === 'en' ? 'Cancel' : 'إلغاء'}
  </button>
  <button
    onClick={onConfirm}
    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
  >
    {locale === 'en' ? 'Yes, Logout' : 'نعم، تسجيل الخروج'}
  </button>
</div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}