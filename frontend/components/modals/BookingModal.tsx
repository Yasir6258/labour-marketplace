'use client';

import React, { useState } from 'react';
import { BrokerProfile } from '@/lib/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Users,
  ChevronDown
} from 'lucide-react';

import { useAuth } from '@/lib/context/AuthContext';

interface BookingModalProps {
  broker: BrokerProfile;
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceBreakdownItem {
  category: string;
  count: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({ broker, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { createBooking } = useData();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || 'Tanvir Hossain');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '01700112233');

  // ALL AVAILABLE SERVICES COMBINED (Broker's services + Common categories like Driver, Cleaner, Painter, etc.)
  const allAvailableCategories = Array.from(new Set([
    ...(broker.servicesOffered || []),
    'Labourer',
    'Electrician',
    'Plumber',
    'Mason',
    'Driver',
    'Cleaner',
    'Painter'
  ]));

  // DYNAMIC PER-SERVICE WORKER QUANTITY BREAKDOWN STATE (REQ: PER-SERVICE QUANTITY & ADD SERVICE)
  const [serviceItems, setServiceItems] = useState<ServiceBreakdownItem[]>([
    { category: broker.servicesOffered[0] || 'Labourer', count: 2 }
  ]);

  const [selectedAddCategory, setSelectedAddCategory] = useState<string>('');
  const [isAddingNewRow, setIsAddingNewRow] = useState<boolean>(false);

  const [date, setDate] = useState('2026-08-10');
  const [address, setAddress] = useState(`${broker.location.upazila}, ${broker.location.district}`);
  const [details, setDetails] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Calculate total workers dynamically
  const totalWorkersCount = serviceItems.reduce((sum, item) => sum + item.count, 0);

  const handleUpdateItemCount = (index: number, newCount: number) => {
    if (newCount < 1) return;
    const updated = [...serviceItems];
    updated[index].count = newCount;
    setServiceItems(updated);
  };

  const handleRemoveServiceItem = (index: number) => {
    if (serviceItems.length <= 1) return; // Keep at least one
    setServiceItems(serviceItems.filter((_, i) => i !== index));
  };

  const handleAddNewServiceRow = () => {
    if (!selectedAddCategory) return;
    // Check if already in list
    const existingIdx = serviceItems.findIndex(item => item.category === selectedAddCategory);
    if (existingIdx !== -1) {
      // Increment existing count
      const updated = [...serviceItems];
      updated[existingIdx].count += 1;
      setServiceItems(updated);
    } else {
      // Add new row with initial 1 worker
      setServiceItems([...serviceItems, { category: selectedAddCategory, count: 1 }]);
    }

    setSelectedAddCategory('');
    setIsAddingNewRow(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceCategories = serviceItems.map(item => item.category);
    const serviceCategorySummary = serviceItems.map(item => `${item.count} ${item.category}`).join(', ');

    createBooking({
      brokerId: broker.id,
      brokerName: broker.name,
      brokerLocation: `${broker.location.district} (${broker.location.upazila})`,
      serviceCategory: serviceCategorySummary,
      serviceCategories,
      serviceBreakdown: serviceItems,
      workersCount: totalWorkersCount,
      workDate: date,
      address,
      details: details || `Breakdown: ${serviceCategorySummary}`,
      customerName,
      customerPhone
    });

    setIsSuccess(true);
  };

  // Categories not yet added
  const remainingCategoriesToAdd = allAvailableCategories.filter(
    cat => !serviceItems.some(item => item.category === cat)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="w-full max-w-xl glass-panel bg-slate-900/95 border border-slate-700/60 rounded-3xl p-6 sm:p-8 relative my-8 shadow-2xl shadow-emerald-950/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-700/50 inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Labour.com Verified Broker Escrow Booking
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
                Book Workers from {broker.name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Location: {broker.location.division} ({broker.location.district} - {broker.location.upazila})</span>
              </p>
            </div>

            {/* HIGH-TRUST ৳500 REFUND GUARANTEE NOTICE BANNER */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2.5">
                <div className="flex items-center gap-2 font-black text-sm text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'bn' ? 'ব্রোকার বুকিং ও ১০০% টাকা ফেরতের নিয়ম' : 'Broker Booking & 100% Refund Guarantee'}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-black bg-emerald-900 text-emerald-300 border border-emerald-600/40">
                  100% REFUNDABLE
                </span>
              </div>

              {/* Exact 3-Point Bangla/English Message */}
              <div className="text-xs text-slate-200 leading-relaxed space-y-2">
                {language === 'bn' ? (
                  <>
                    <p className="font-semibold text-emerald-200 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>ব্রোকার কনফার্মেশনের জন্য আপনাকে <strong>৳৫০০ টাকা অগ্রিম</strong> প্রদান করতে হবে।</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>আগামী <strong>২৪ ঘণ্টার মধ্যে</strong> ব্রোকার আপনাকে সরাসরি কল দিয়ে কাজ এবং মজুরির টাকা নিয়ে কথা বলবেন।</span>
                    </p>
                    <p className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-600/50 text-emerald-300 font-extrabold flex items-center gap-2 shadow-inner">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>আপনি ব্রোকারকে বুকড করেন কিংবা না করেন — আপনার এই ৳৫০০ টাকা সম্পূর্ণ ১০০% নিশ্চিতভাবে ফেরত দেওয়া হবে।</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-emerald-200 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>To confirm your broker booking, an advance deposit of <strong>৳500</strong> is required.</span>
                    </p>
                    <p className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>Within <strong>24 hours</strong>, the broker will contact you directly to discuss job details and final rates.</span>
                    </p>
                    <p className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-600/50 text-emerald-300 font-extrabold flex items-center gap-2 shadow-inner">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Whether you decide to book the broker or not — your ৳500 deposit is 100% GUARANTEED TO BE REFUNDED to you.</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Customer Details Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your Full Name</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mobile Phone (+880)</span>
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium font-mono"
                  required
                />
              </div>
            </div>

            {/* DYNAMIC PER-SERVICE WORKER QUANTITY BREAKDOWN */}
            <div className="space-y-3.5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <label className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-emerald-400" />
                  <span>Select Services & Worker Quantities (প্রতি সার্ভিসে কতজন লাগবে)</span>
                </label>
                <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700/50 shadow-sm">
                  Total: {totalWorkersCount} Workers
                </span>
              </div>

              {/* Service Rows */}
              <div className="space-y-2.5">
                {serviceItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800/90 gap-3 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-sm font-extrabold text-white capitalize">{item.category}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-700/80 rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemCount(idx, item.count - 1)}
                          className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white font-black text-sm transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3.5 py-1.5 font-mono font-black text-emerald-300 text-xs bg-slate-900 border-x border-slate-800">
                          {item.count} {item.count === 1 ? 'Worker' : 'Workers'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemCount(idx, item.count + 1)}
                          className="px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-white font-black text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Row Button */}
                      {serviceItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceItem(idx)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/60 rounded-xl transition-all"
                          title="Remove service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD ANOTHER SERVICE BUTTON & DROPDOWN */}
              {!isAddingNewRow ? (
                <button
                  type="button"
                  onClick={() => setIsAddingNewRow(true)}
                  className="w-full py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-dashed border-emerald-500/50 text-emerald-300 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.005]"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Add Another Service (যেমন: ড্রাইভার, ইলেকট্রিশিয়ান, ক্লিনার যোগ করুন)</span>
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/50 space-y-2.5 shadow-xl">
                  <span className="text-xs font-black text-slate-200 block uppercase tracking-wider">Select Additional Service Category:</span>
                  <div className="flex gap-2">
                    <select
                      value={selectedAddCategory}
                      onChange={(e) => setSelectedAddCategory(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white capitalize focus:outline-none focus:border-emerald-500"
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
                      className={`px-4 py-2.5 rounded-xl text-xs font-black text-white transition-all ${
                        selectedAddCategory ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      Add Service
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsAddingNewRow(false)}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Work Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Worksite Address</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Job Details & Requirements</span>
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g., Need 2 labourers for shifting + 1 driver for 5 hours..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>

            {/* Mobile Banking Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs gap-2">
              <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Advance Deposit Payment Gateway:</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-pink-950/90 text-pink-300 font-extrabold text-[11px] border border-pink-600/50 shadow-sm shadow-pink-950">bKash</span>
                <span className="px-3 py-1 rounded-xl bg-orange-950/90 text-orange-300 font-extrabold text-[11px] border border-orange-600/50 shadow-sm shadow-orange-950">Nagad</span>
                <span className="px-3 py-1 rounded-xl bg-purple-950/90 text-purple-300 font-extrabold text-[11px] border border-purple-600/50 shadow-sm shadow-purple-950">Rocket</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-[1.01] transition-transform text-white font-black text-xs shadow-xl shadow-emerald-950 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Pay ৳500 Deposit & Send Multi-Service Request ({totalWorkersCount} Workers Total)</span>
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce shadow-xl shadow-emerald-950">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Booking Request Placed!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Workforce Requested: <strong className="text-emerald-400">{serviceItems.map(item => `${item.count} ${item.category}`).join(', ')}</strong> ({totalWorkersCount} Total Workers). <br />
              Your ৳500 deposit is received in escrow. <strong>{broker.name}</strong> will contact you at <strong>{customerPhone}</strong> within 24 hours. Your ৳500 will be refunded upon confirmation!
            </p>

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg"
            >
              Go to Customer Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
