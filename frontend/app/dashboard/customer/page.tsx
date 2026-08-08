'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { PaymentModal } from '@/components/modals/PaymentModal';
import { ReviewModal } from '@/components/modals/ReviewModal';
import { AIContractModal } from '@/components/ai/AIContractModal';
import { Booking } from '@/lib/types';
import { 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  ShieldAlert,
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Star, 
  RotateCcw,
  UserCheck,
  Search,
  XCircle,
  DollarSign,
  Send,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';

export default function CustomerDashboard() {
  const { t, language } = useLanguage();
  const { 
    bookings, 
    favorites, 
    brokers, 
    completeJob, 
    rejectBookingByCustomer, 
    setAgreedAmountByCustomer,
    submitCustomerWorkDoneWithReview
  } = useData();
  const { role, user } = useAuth();

  // All React Hooks declared at top before early returns (Rules of Hooks)
  const [activeTab, setActiveTab] = useState<'bookings' | 'favorites'>('bookings');
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [selectedBookingForContract, setSelectedBookingForContract] = useState<Booking | null>(null);
  const [selectedBookingForCompletion, setSelectedBookingForCompletion] = useState<Booking | null>(null);
  const [completionRating, setCompletionRating] = useState<number>(5);
  const [completionComment, setCompletionComment] = useState<string>('কাজ চমৎকারভাবে সম্পন্ন হয়েছে, ব্রোকার এজেন্সি এবং শ্রমিক খুব পেশাদার ছিল।');
  const [editingRateBookingId, setEditingRateBookingId] = useState<string | null>(null);
  const [customRateInput, setCustomRateInput] = useState<number>(3500);

  if (!user || role !== 'customer') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          This portal is strictly reserved for Customer accounts. You are currently logged in as <strong className="text-emerald-400 uppercase">{role || 'Guest'}</strong>.
        </p>
        <Link href={user ? `/dashboard/${role}` : '/auth/login'} className="inline-block py-2.5 px-6 rounded-xl gradient-bg text-white font-bold text-xs">
          Go to My Authorized Dashboard ({role?.toUpperCase() || 'LOGIN'})
        </Link>
      </div>
    );
  }

  const favoritedBrokers = brokers.filter(b => favorites.includes(b.id));

  const handleSaveCustomRate = (bookingId: string) => {
    if (customRateInput > 0) {
      setAgreedAmountByCustomer(bookingId, customRateInput);
      setEditingRateBookingId(null);
    }
  };

  // Filter bookings belonging strictly to this logged-in customer
  const userBookings = bookings.filter(b => {
    if (!user) return false;
    // Demo account fallback for Tanvir Hossain
    if (user.email === 'tanvir@gmail.com' || user.id === 'cust_1') {
      return b.customerId === 'cust_1' || b.customerName?.toLowerCase().includes('tanvir');
    }
    // Real registered customer accounts see strictly their own bookings
    return (
      b.customerId === user.id || 
      (b.customerName && b.customerName.toLowerCase() === user.name?.toLowerCase()) || 
      (b.customerPhone && b.customerPhone === user.phone)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Consumer Marketplace Portal
            </span>
            <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600/40">
              Active Account
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{language === 'bn' ? `স্বাগতম, ${user?.name || 'কাস্টমার'}!` : `Welcome, ${user?.name || 'Customer'}! 👋`}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Phone: <strong className="text-slate-200">{user?.phone || '+880 1700-000000'}</strong> • Email: <strong className="text-slate-200">{user?.email}</strong> • Location: <strong className="text-emerald-400">{user?.location?.division || 'Dhaka'} ({user?.location?.district || 'Dhaka'} - {user?.location?.upazila || 'Mirpur'})</strong>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Bookings ({userBookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Saved Brokers ({favoritedBrokers.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MY BOOKINGS & ESCROW WORKFLOW */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {userBookings.length > 0 ? (
            <div className="space-y-6">
              {userBookings.map((b) => (
                <div key={b.id} className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                  
                  {/* Top Status Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                            : b.status === 'Completed'
                            ? 'bg-teal-950 text-teal-300 border border-teal-600/40'
                            : b.status === 'Cancelled'
                            ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                        }`}>
                          Status: {b.status}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{b.brokerName}</h2>
                      <p className="text-xs text-slate-400">Location: {b.brokerLocation}</p>
                    </div>

                    {/* REJECTION / CANCEL BUTTON (REQ 2: SCENARIO B) */}
                    {b.status === 'Pending' && (
                      <button
                        onClick={() => rejectBookingByCustomer(b.id)}
                        className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-600/40 font-bold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Dislike Deal? Reject & Request ৳500 Refund from Labour.com</span>
                      </button>
                    )}
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Services Requested</span>
                      <strong className="text-white capitalize">
                        {b.serviceCategories ? b.serviceCategories.join(', ') : b.serviceCategory} ({b.workersCount} Workers)
                      </strong>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Work Date & Address</span>
                      <span className="text-slate-200 block">{b.workDate}</span>
                      <span className="text-slate-400 text-[11px] block">{b.address}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">৳500 Deposit Refund Status</span>
                      {b.depositRefunded ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 
                          100% Refunded (Issued by {b.refundIssuedBy === 'Broker' ? 'Broker' : 'Labour.com Platform'})
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-4 h-4 animate-spin" /> Held in Escrow (Refreshes on deal)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CUSTOM AGREED RATE & PAYMENT PIPELINE (REQ 3) */}
                  {b.status === 'Confirmed' && (
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white">Agreed Job Rate & Admin Payment Pipeline</span>
                        </div>

                        {b.customAgreedAmount && (
                          <span className="text-xs font-extrabold text-emerald-400">
                            Negotiated Rate: ৳{b.customAgreedAmount} BDT
                          </span>
                        )}
                      </div>

                      {/* Step 1: Customer Enters Agreed Amount */}
                      {!b.customAgreedAmount ? (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-300">
                            Have you and the broker agreed on the final job cost after calling? Enter the agreed total amount below:
                          </p>
                          <div className="flex gap-2 max-w-sm">
                            <input
                              type="number"
                              value={customRateInput}
                              onChange={(e) => setCustomRateInput(Number(e.target.value))}
                              placeholder="e.g. 3500"
                              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white flex-1"
                            />
                            <button
                              onClick={() => handleSaveCustomRate(b.id)}
                              className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs"
                            >
                              Save Agreed Rate
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Step 2 & 3 Pipeline Status */
                        <div className="text-xs space-y-2">
                          {b.paymentRequestStatus === 'NotRequested' && (
                            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-600/40 text-amber-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" /> Agreed rate saved (৳{b.customAgreedAmount}). Waiting for Broker to submit payment request to Admin.
                              </span>
                            </div>
                          )}

                          {b.paymentRequestStatus === 'RequestedToAdmin' && (
                            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-600/40 text-blue-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Send className="w-4 h-4" /> Broker submitted payment request to Labour.com Admin. Awaiting Admin verification...
                              </span>
                            </div>
                          )}

                          {(b.paymentRequestStatus === 'ApprovedByAdmin' || b.paymentRequestStatus === 'PaidByCustomer') && !b.finalPaid && (
                            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Admin Approved Payment Request! You can now deposit ৳{b.customAgreedAmount} into Escrow.
                              </span>
                              <button
                                onClick={() => setSelectedBookingForPayment(b)}
                                className="px-4 py-2 rounded-xl gradient-bg text-white font-bold text-xs"
                              >
                                Deposit ৳{b.customAgreedAmount} to Escrow
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2: CUSTOMER WORK VERIFICATION & RATING SUBMISSION */}
                  {b.status === 'Confirmed' && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
                            Step 2: Customer Work Delivery & Rating Confirmation
                          </span>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {b.brokerWorkDoneStatus === 'Requested' 
                              ? '🔔 Broker Has Handed Over Completed Work Notice!' 
                              : 'Work In Progress / Ongoing Execution'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Once you inspect the delivered work, confirm completion with your star rating & review comment for Admin worker payout release.
                          </p>
                        </div>

                        {b.customerWorkDoneStatus === 'Confirmed' ? (
                          <div className="px-4 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold text-xs border border-emerald-600/40 flex items-center gap-1.5 whitespace-nowrap">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Work Received & Rated ({b.customerRating} ★)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedBookingForCompletion(b);
                              setCompletionRating(5);
                            }}
                            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-black text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
                          >
                            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                            <span>Confirm Work Received, Rate & Submit to Admin (কাজ বুঝিয়া পাইলাম)</span>
                          </button>
                        )}
                      </div>

                      {b.customerWorkDoneStatus === 'Confirmed' && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-400 flex items-center gap-1">
                              Rating: {b.customerRating} <Star className="w-3.5 h-3.5 fill-amber-400" />
                            </span>
                            <span className="text-slate-400">• Comment: "{b.customerComment}"</span>
                          </div>
                          <p className="text-emerald-400 font-bold">
                            ✓ Final Confirmation sent to Master Admin. Admin will release worker payout!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment & Review Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {b.finalPaid ? (
                      <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> Final payment (৳{b.finalAmount}) secured in Escrow.
                      </div>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex items-center gap-2">
                      {/* AI Legal Contract Generator Button */}
                      {(b.status === 'Confirmed' || b.status === 'Completed') && (
                        <button
                          onClick={() => setSelectedBookingForContract(b)}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 font-bold text-xs border border-emerald-600/40 flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span>Generate AI Legal Work Contract</span>
                        </button>
                      )}

                      {b.status === 'Confirmed' && b.finalPaid && (
                        <button
                          onClick={() => completeJob(b.id)}
                          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
                        >
                          Confirm Job Completion & Release Payout
                        </button>
                      )}

                      {b.status === 'Completed' && (
                        <button
                          onClick={() => setSelectedBookingForReview(b)}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-4 h-4 fill-white" />
                          <span>Write Broker Review & Rating</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* New Customer Account Welcome Banner */}
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700/40 inline-flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      {language === 'bn' ? 'নতুন কাস্টমার অ্যাকাউন্ট সক্রিয়' : 'New Customer Account Active'}
                    </span>

                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {language === 'bn' 
                        ? `স্বাগতম ${user?.name || 'প্রিয় গ্রাহক'}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে`
                        : `Welcome ${user?.name || 'Valued Customer'}! Your Account is Ready`}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {language === 'bn'
                        ? 'আপনার এলাকার যাচাইকৃত ব্রোকার এজেন্সির মাধ্যমে ইলেকট্রিশিয়ান, প্লাম্বার, ড্রাইভার, রাজমিস্ত্রি বা ক্লিনার বুকিং দিন। ১০০% ৳৫০০ টাকা ডিপোজিট রিফান্ড গ্যারান্টি সুবিধা রয়েছে।'
                        : 'Hire verified electricians, plumbers, masons, drivers or labourers in your division. Enjoy 100% ৳500 deposit refund guarantee on every booking!'}
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="px-6 py-3.5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Search className="w-4 h-4" />
                    <span>{language === 'bn' ? 'ব্রোকার ও শ্রমিক খুঁজুন' : 'Find & Book Brokers'}</span>
                  </Link>
                </div>
              </div>

              {/* Direct Broker Booking Grid for New Customers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>{language === 'bn' ? 'আপনার জন্য শীর্ষ ভেরিফাইড ব্রোকার এজেন্সি' : 'Top Verified Broker Agencies Ready to Hire'}</span>
                  </h3>

                  <Link href="/" className="text-xs font-bold text-emerald-400 hover:underline">
                    {language === 'bn' ? 'সব ব্রোকার দেখুন →' : 'View All Brokers →'}
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brokers.slice(0, 3).map((b) => (
                    <div key={b.id} className="glass-panel bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                          {b.location.division} ({b.location.district})
                        </span>
                        <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {b.ratingAvg}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-white">{b.name}</h4>
                      <p className="text-xs text-slate-400">
                        Workforce: <strong className="text-slate-200">{b.workerCount} Workers</strong> ({b.servicesOffered.join(', ')})
                      </p>

                      <Link
                        href={`/brokers/${b.id}`}
                        className="block text-center py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow-md hover:opacity-90 transition-opacity"
                      >
                        ⚡ Book Agency & Hire Workers
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVORITED BROKERS */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <span>My Bookmarked Broker Agencies ({favoritedBrokers.length})</span>
          </h2>

          {favoritedBrokers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritedBrokers.map((broker) => (
                <div key={broker.id} className="glass-panel bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-lg font-bold text-white">{broker.name}</h3>
                  <p className="text-xs text-slate-400">{broker.location.division} ({broker.location.district})</p>
                  <Link href={`/brokers/${broker.id}`} className="block text-center py-2 rounded-xl gradient-bg text-white font-bold text-xs">
                    View Agency Workforce Profile
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
              <Heart className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'এখনো কোনো ব্রোকার সেভ করা হয়নি' : 'No Bookmarked Brokers Yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {language === 'bn' 
                  ? 'যেকোনো ব্রোকার কার্ডের হার্ট (❤️) আইকনে ক্লিক করে এজেন্সিকে দ্রুত বুকমার্ক করে রাখুন।'
                  : 'Click the heart (❤️) icon on any broker card to save them here for quick access!'}
              </p>
              <Link href="/" className="inline-block px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs mt-2">
                {language === 'bn' ? 'ব্রোকার মার্কেটপ্লেস দেখুন' : 'Browse Broker Marketplace'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedBookingForPayment && (
        <PaymentModal
          booking={selectedBookingForPayment}
          isOpen={true}
          onClose={() => setSelectedBookingForPayment(null)}
        />
      )}

      {selectedBookingForReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          isOpen={true}
          onClose={() => setSelectedBookingForReview(null)}
        />
      )}

      {selectedBookingForContract && (
        <AIContractModal
          booking={selectedBookingForContract}
          isOpen={true}
          onClose={() => setSelectedBookingForContract(null)}
        />
      )}

      {/* WORK DONE CONFIRMATION & RATING MODAL */}
      {selectedBookingForCompletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedBookingForCompletion(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700">
                Final Work Completion & Worker Payout Request
              </span>
              <h3 className="text-xl font-black text-white">
                {language === 'bn' ? 'কাজ প্রাপ্তি স্বীকার ও রেটিং প্রদান' : 'Confirm Work Delivery & Rate Service'}
              </h3>
              <p className="text-xs text-slate-400">
                Agency: <strong className="text-white">{selectedBookingForCompletion.brokerName}</strong>
              </p>
            </div>

            {/* STAR RATING PICKER */}
            <div className="space-y-2 text-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'ব্রোকার এজেন্সি ও শ্রমিক কাজের রেটিং (১ থেকে ৫ স্টার)' : 'Rate Agency & Workers Service (1 to 5 Stars)'}
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCompletionRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= completionRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 fill-slate-800'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-extrabold text-amber-400">
                {completionRating === 5 ? '⭐⭐⭐⭐⭐ Excellent Job!' : completionRating === 4 ? '⭐⭐⭐⭐ Good Service' : `${completionRating} Stars`}
              </span>
            </div>

            {/* REVIEW COMMENT TEXTAREA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'কাজের অভিজ্ঞতা বা মতামত (কমেন্ট)' : 'Write Review Comment for Admin & Broker'}
              </label>
              <textarea
                rows={3}
                value={completionComment}
                onChange={(e) => setCompletionComment(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                placeholder="যেমন: কাজ শতভাগ সুশৃঙ্খলভাবে সম্পন্ন হয়েছে..."
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={() => {
                submitCustomerWorkDoneWithReview(
                  selectedBookingForCompletion.id,
                  completionRating,
                  completionComment
                );
                setSelectedBookingForCompletion(null);
              }}
              className="w-full py-3.5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{language === 'bn' ? 'এডমিনের নিকট কনফার্মেশন ও রেটিং পাঠান' : 'Submit Final Work Confirmation to Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
