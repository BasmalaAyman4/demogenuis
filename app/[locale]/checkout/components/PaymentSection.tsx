// components/checkout/PaymentSection.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisaToken {
  cardToken: string;
  cardNumber: string;
  cardAlias: string;
}

interface PaymentSectionProps {
  paymentType: 1 | 2;
  onPaymentTypeChange: (type: 1 | 2) => void;
  visaTokens: VisaToken[];
  selectedCard: VisaToken | null;
  onSelectCard: (card: VisaToken | null) => void;
  locale:string
}

export function PaymentSection({
  paymentType,
  onPaymentTypeChange,
  visaTokens,
  selectedCard,
  onSelectCard,
  locale
}: PaymentSectionProps) {
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{locale=='en'?'Payment Method':'طريقة الدفع'}</h2>

      <div className="space-y-4">
        {/* Cash Payment */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => {
            onPaymentTypeChange(1);
            onSelectCard(null);
          }}
          className={`
            relative p-5 rounded-lg border-2 cursor-pointer transition-all
            ${paymentType === 1
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`
              w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all
              ${paymentType === 1 ? 'border-blue-500' : 'border-gray-300'}
            `}>
              {paymentType === 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full bg-blue-500 scale-50"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💵</span>
              </div>
              <div>
                 {locale === 'en' ? (
    <>
      <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
      <p className="text-sm text-gray-600">Pay when you receive your order</p>
    </>
  ) : (
    <>
      <h3 className="font-semibold text-gray-900">الدفع عند الاستلام</h3>
      <p className="text-sm text-gray-600">ادفع عند استلام طلبك</p>
    </>
  )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visa/Card Payment */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => onPaymentTypeChange(2)}
          className={`
            relative p-5 rounded-lg border-2 cursor-pointer transition-all
            ${paymentType === 2
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className={`
              w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all
              ${paymentType === 2 ? 'border-blue-500' : 'border-gray-300'}
            `}>
              {paymentType === 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full bg-blue-500 scale-50"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div>
               {locale === 'en' ? (
    <>
      <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
      <p className="text-sm text-gray-600">Pay securely with your card</p>
    </>
  ) : (
    <>
      <h3 className="font-semibold text-gray-900">بطاقة ائتمان / خصم</h3>
      <p className="text-sm text-gray-600">ادفع بأمان باستخدام بطاقتك</p>
    </>
  )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Saved Cards Section (only for Visa) */}
        <AnimatePresence>
          {paymentType === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                {visaTokens.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700">Saved Cards</h3>
                    {visaTokens.map((card, index) => (
                      <motion.div
                        key={card.cardToken}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelectCard(card)}
                        className={`
                          p-4 rounded-lg border cursor-pointer transition-all
                          ${selectedCard?.cardToken === card.cardToken
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-5 h-5 rounded-full border-2 transition-all
                            ${selectedCard?.cardToken === card.cardToken
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                            }
                          `}>
                            {selectedCard?.cardToken === card.cardToken && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-full h-full rounded-full bg-white scale-50"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{card.cardAlias}</p>
                            <p className="text-sm text-gray-600">•••• {card.cardNumber}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowNewCardForm(!showNewCardForm);
                    onSelectCard(null);
                  }}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all"
                >
                   {locale=='en'?'+ Add New Card':'+ إضافة بطاقة جديدة'}
                </button>

                {/* New Card Form */}
                <AnimatePresence>
                  {showNewCardForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           {locale=='en'?'Card Number':'رقم البطاقة'}
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {locale=='en'?'Expiry Date':'تاريخ انتهاء'}
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                             {locale=='en'?'CVV':'CVV'}
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                           {locale=='en'?'Card Holder Name':'اسم حامل البطاقة'}
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}