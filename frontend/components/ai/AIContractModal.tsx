'use client';

import React from 'react';
import { Booking } from '@/lib/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  FileText, 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  User, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Award,
  Lock
} from 'lucide-react';

interface AIContractModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

export const AIContractModal: React.FC<AIContractModalProps> = ({ booking, isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const contractId = `LGL-BD-${booking.id.replace('BK-', '')}-2026`;
  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-3xl glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-10 relative my-8 shadow-2xl space-y-6 text-slate-100 print:text-black print:bg-white print:border-none print:shadow-none print:my-0">
        
        {/* Top Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/40 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              AI Automated Legal Contract Deed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:opacity-90 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Contract PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LEGAL CONTRACT DEED CONTENT (Bilingual) */}
        <div className="space-y-6 bg-slate-950/60 p-6 sm:p-8 rounded-2xl border border-slate-800 print:bg-white print:p-0 print:border-none">
          
          {/* Header Stamp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-emerald-500/40 pb-6 print:border-black">
            <div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block print:text-black">
                REPUBLIC OF BANGLADESH • LABOUR MARKETPLACE DEED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 print:text-black">
                LEGAL WORKPLACE SERVICE AGREEMENT
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono mt-0.5">
                Contract Deed No: <strong>{contractId}</strong> • Date: {todayDate}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-center shrink-0 print:bg-gray-100 print:border-black">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto print:text-black" />
              <span className="text-[10px] font-bold uppercase text-emerald-300 block mt-1 print:text-black">
                Labour.com Verified Legal Deed
              </span>
            </div>
          </div>

          {/* Contracting Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block print:text-gray-600">
                PARTY A: THE CUSTOMER (HIRER)
              </span>
              <h3 className="text-sm font-bold text-white print:text-black">{booking.customerName}</h3>
              <p className="text-slate-300 print:text-gray-700">Phone: {booking.customerPhone}</p>
              <p className="text-slate-400 print:text-gray-600">Worksite Address: {booking.address}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 print:bg-gray-50 print:border-gray-300">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block print:text-gray-600">
                PARTY B: THE BROKER AGENCY (PROVIDER)
              </span>
              <h3 className="text-sm font-bold text-emerald-400 print:text-black">{booking.brokerName}</h3>
              <p className="text-slate-300 print:text-gray-700">Location: {booking.brokerLocation}</p>
              <p className="text-slate-400 print:text-gray-600">Verification Seal: Official Labour.com Agency</p>
            </div>
          </div>

          {/* Agreed Terms & Workforce Schedule */}
          <div className="space-y-3 border-t border-b border-slate-800 py-4 print:border-gray-300 text-xs">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5 print:text-black">
              <Award className="w-4 h-4 text-emerald-400 print:text-black" />
              <span>Agreed Workforce Schedule & Financial Terms</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl print:bg-gray-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block print:text-gray-600">Services Scheduled</span>
                <strong className="text-white print:text-black capitalize">{booking.serviceCategory}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block print:text-gray-600">Workforce Count</span>
                <strong className="text-emerald-400 print:text-black">{booking.workersCount} Workers</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block print:text-gray-600">Work Date</span>
                <strong className="text-white print:text-black">{booking.workDate}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block print:text-gray-600">Agreed Contract Value</span>
                <strong className="text-emerald-400 print:text-black">৳{booking.customAgreedAmount || booking.finalAmount || 3500} BDT</strong>
              </div>
            </div>
          </div>

          {/* Legal Clauses & Warranties */}
          <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed print:text-gray-800">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider print:text-black">
              Binding Contract Terms & Conditions:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>
                <strong>100% ৳500 Advance Deposit Refund Warranty:</strong> Party A's ৳500 advance deposit is held in escrow and guaranteed 100% refundable by Labour.com upon broker confirmation or deal cancellation.
              </li>
              <li>
                <strong>Escrow Protection:</strong> The agreed contract value of ৳{booking.customAgreedAmount || booking.finalAmount || 3500} BDT shall be held in Labour.com Escrow and released to Party B ONLY AFTER Party A confirms satisfactory job completion.
              </li>
              <li>
                <strong>Workplace Safety & Compliance:</strong> Party B guarantees that all assigned workers are verified, skilled, and abide by workplace safety standards across Bangladesh.
              </li>
            </ol>
          </div>

          {/* Signature Blocks */}
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-800 print:border-gray-300 text-xs">
            <div className="text-center space-y-8">
              <div className="h-10 font-script text-emerald-400 font-bold text-base print:text-black border-b border-slate-700 print:border-black">
                {booking.customerName} (Digital Signature)
              </div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase print:text-gray-600">
                Signature of Customer (Hirer)
              </span>
            </div>

            <div className="text-center space-y-8">
              <div className="h-10 font-script text-emerald-400 font-bold text-base print:text-black border-b border-slate-700 print:border-black">
                {booking.brokerName} (Official Seal)
              </div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase print:text-gray-600">
                Signature of Broker Agency (Provider)
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
