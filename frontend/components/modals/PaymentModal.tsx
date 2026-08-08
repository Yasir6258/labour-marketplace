'use client';

import React, { useState } from 'react';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { X, Lock, CreditCard, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ booking, isOpen, onClose }) => {
  const { t } = useLanguage();
  const { payFinalEscrow } = useData();

  const [finalAmount, setFinalAmount] = useState<number>(booking.finalAmount || 1500);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Card'>('bKash');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePayFinal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      payFinalEscrow(booking.id, finalAmount, paymentMethod);
      setIsProcessing(false);
      setCompleted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!completed ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>{t('payFinalEscrow')}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Booking #{booking.id} - {booking.brokerName}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Agreed Total Amount (৳ BDT)
              </label>
              <input
                type="number"
                value={finalAmount}
                onChange={(e) => setFinalAmount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('selectPaymentMethod')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['bKash', 'Nagad', 'Rocket', 'Card'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m as any)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      paymentMethod === m
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{m}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Escrow Hold Protection:</span>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Funds are securely held by Labour.com and will only be released to the broker after job completion.
              </p>
            </div>

            <button
              onClick={handlePayFinal}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl gradient-bg text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Escrow...' : `Pay ৳${finalAmount} into Escrow`}
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Payment Received in Escrow!</h4>
            <p className="text-xs text-slate-400">
              The broker will proceed with the job. You can mark the job complete upon satisfaction to release payment.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
            >
              {t('closeModal')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
