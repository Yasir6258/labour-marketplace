'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { calculateMultiServiceAIEstimate, PriceEstimateResult } from '@/lib/ai/aiService';
import { BANGLADESH_LOCATIONS } from '@/lib/data/bangladesh-locations';
import { 
  Sparkles, 
  X, 
  Calculator, 
  DollarSign, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface AIEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceBreakdownItem {
  category: string;
  count: number;
}

export const AIEstimatorModal: React.FC<AIEstimatorModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  const allAvailableCategories = [
    'Labourer',
    'Electrician',
    'Plumber',
    'Mason',
    'Driver',
    'Cleaner',
    'Painter'
  ];

  // MULTIPLE WORK ROLES & WORKER QUANTITY BREAKDOWN (EXACT REQ)
  const [serviceItems, setServiceItems] = useState<ServiceBreakdownItem[]>([
    { category: 'Plumber', count: 1 },
    { category: 'Labourer', count: 2 }
  ]);

  const [selectedAddCategory, setSelectedAddCategory] = useState<string>('');
  const [isAddingNewRow, setIsAddingNewRow] = useState<boolean>(false);

  const [division, setDivision] = useState('Dhaka');
  const [scopeSize, setScopeSize] = useState('3-4 Rooms Apartment');
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Emergency'>('Standard');

  const [result, setResult] = useState<PriceEstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  const totalWorkersCount = serviceItems.reduce((sum, item) => sum + item.count, 0);

  const handleUpdateItemCount = (index: number, newCount: number) => {
    if (newCount < 1) return;
    const updated = [...serviceItems];
    updated[index].count = newCount;
    setServiceItems(updated);
  };

  const handleRemoveServiceItem = (index: number) => {
    if (serviceItems.length <= 1) return;
    setServiceItems(serviceItems.filter((_, i) => i !== index));
  };

  const handleAddNewServiceRow = () => {
    if (!selectedAddCategory) return;
    const existingIdx = serviceItems.findIndex(item => item.category === selectedAddCategory);
    if (existingIdx !== -1) {
      const updated = [...serviceItems];
      updated[existingIdx].count += 1;
      setServiceItems(updated);
    } else {
      setServiceItems([...serviceItems, { category: selectedAddCategory, count: 1 }]);
    }
    setSelectedAddCategory('');
    setIsAddingNewRow(false);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      const res = calculateMultiServiceAIEstimate({
        serviceItems,
        division,
        scopeSize,
        urgency
      });
      setResult(res);
      setIsCalculating(false);
    }, 500);
  };

  const remainingCategoriesToAdd = allAvailableCategories.filter(
    cat => !serviceItems.some(item => item.category === cat)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 relative my-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-emerald-950">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
                Labour.com AI Market Calculator
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight mt-0.5">
              AI Intelligent Price & Workforce Estimator
            </h2>
            <p className="text-xs text-slate-400">
              Set multiple work roles & specify worker counts (যেমন: প্লাম্বার + ড্রাইভার + লেবার)
            </p>
          </div>
        </div>

        {/* Dynamic Multi-Service Selection Area (MATCHING BOOKING MODAL REQ) */}
        <form onSubmit={handleCalculate} className="space-y-5">
          
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Select Work Roles & Worker Quantities (কাজের রোল ও কতজন লাগবে)</span>
              </label>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
                Total: {totalWorkersCount} Workers
              </span>
            </div>

            {/* Service Rows */}
            <div className="space-y-2.5">
              {serviceItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-bold text-white capitalize">{item.category}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-700 rounded-xl overflow-hidden bg-slate-800">
                      <button
                        type="button"
                        onClick={() => handleUpdateItemCount(idx, item.count - 1)}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-700 hover:text-white font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-mono font-bold text-white text-xs bg-slate-900 border-x border-slate-700">
                        {item.count} {item.count === 1 ? 'Person' : 'Persons'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItemCount(idx, item.count + 1)}
                        className="px-3 py-1 text-slate-300 hover:bg-slate-700 hover:text-white font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Row Button */}
                    {serviceItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveServiceItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors"
                        title="Remove work role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ADD ANOTHER WORK ROLE BUTTON & DROPDOWN (REQ: ADD DRIVER/CLEANER/PAINTER ETC) */}
            {!isAddingNewRow ? (
              <button
                type="button"
                onClick={() => setIsAddingNewRow(true)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Add Another Work Role (যেমন: ড্রাইভার, ইলেকট্রিশিয়ান, ক্লিনার যোগ করুন)</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">Select Work Role Category to Add:</span>
                <div className="flex gap-2">
                  <select
                    value={selectedAddCategory}
                    onChange={(e) => setSelectedAddCategory(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white capitalize"
                  >
                    <option value="">-- Choose Category (e.g. Driver) --</option>
                    {remainingCategoriesToAdd.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    disabled={!selectedAddCategory}
                    onClick={handleAddNewServiceRow}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                      selectedAddCategory ? 'gradient-bg' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    Add Role
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewRow(false)}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Location, Scope & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Division</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {BANGLADESH_LOCATIONS.map((loc) => (
                  <option key={loc.division} value={loc.division}>{loc.division}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Project Scope</label>
              <select
                value={scopeSize}
                onChange={(e) => setScopeSize(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Small Repair Work">Small Repair Work (ছোট কাজ)</option>
                <option value="1-2 Rooms Apartment">1-2 Rooms Apartment (১-২ রুম)</option>
                <option value="3-4 Rooms Apartment">3-4 Rooms Apartment (৩-৪ রুম)</option>
                <option value="Full House / Building Project">Full House / Commercial (পুরো বাসা/প্রজেক্ট)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Standard">Standard (সাধারণ সময়)</option>
                <option value="Urgent">Urgent (জরুরি)</option>
                <option value="Emergency">Emergency (ইমার্জেন্সি)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="w-full py-3.5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            <span>{isCalculating ? 'AI Reasoning in Progress...' : `Calculate Fair AI Estimate for ${totalWorkersCount} Workers in ৳ BDT`}</span>
          </button>
        </form>

        {/* AI ESTIMATION OUTPUT RESULTS CARD */}
        {result && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-3">
              <span className="text-xs font-extrabold uppercase text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Multi-Role Market Estimate
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-emerald-900 text-emerald-300">
                Bangladesh Union BDT Standard
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Daily Rate</span>
                <span className="text-xl font-black text-emerald-400">
                  ৳{result.estimatedCostMin} – ৳{result.estimatedCostMax}
                </span>
                <span className="text-[10px] text-slate-400 block">in Bangladeshi Taka</span>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Configured Workforce</span>
                <div className="text-xs font-bold text-white space-y-0.5">
                  {result.recommendedWorkers.map((w, i) => (
                    <span key={i} className="block text-teal-300">
                      • {w.count} {w.category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Duration</span>
                <span className="text-lg font-black text-amber-400">
                  ~{result.estimatedHours} Hours
                </span>
                <span className="text-[10px] text-slate-400 block">standard completion time</span>
              </div>
            </div>

            {/* AI Market Advice */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>AI Market Recommendation:</span>
              </div>
              <p className="leading-relaxed">
                {language === 'bn' ? result.aiAdviceBn : result.aiAdviceEn}
              </p>
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% ৳500 Deposit Refund Guaranteed
              </span>

              <Link
                href="/"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <span>Find & Book Verified Broker</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
