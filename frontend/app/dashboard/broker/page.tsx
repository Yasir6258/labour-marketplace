'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { WorkerCard } from '@/components/cards/WorkerCard';
import { BANGLADESH_LOCATIONS } from '@/lib/data/bangladesh-locations';
import { SERVICE_CATEGORIES } from '@/lib/data/categories';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  ShieldCheck, 
  Trash2, 
  AlertTriangle,
  Ban,
  UserCheck,
  Edit,
  Save,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldAlert,
  Send,
  X,
  BookOpen,
  Award,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function BrokerDashboard() {
  const { t, language } = useLanguage();
  const { 
    brokers, 
    bookings, 
    confirmBookingByBroker, 
    addWorker, 
    deleteWorker, 
    updateBrokerProfile,
    requestPaymentByBroker,
    submitBrokerWorkDone
  } = useData();
  const { role, user } = useAuth();

  // All React Hooks declared at top before early returns (Rules of Hooks)
  const currentBroker = brokers[0]; 
  const brokerBookings = bookings.filter(b => b.brokerId === currentBroker?.id);

  const [activeTab, setActiveTab] = useState<'requests' | 'workers' | 'profile' | 'rules'>('requests');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(currentBroker?.servicesOffered[0] || 'Electrician');
  const [dailyRate, setDailyRate] = useState(1000);
  const [exp, setExp] = useState(5);

  const [editName, setEditName] = useState(currentBroker?.name || '');
  const [editNameBn, setEditNameBn] = useState(currentBroker?.nameBn || '');
  const [editPhone, setEditPhone] = useState(currentBroker?.phone || '');
  const [editEmail, setEditEmail] = useState(currentBroker?.email || '');
  const [editBioEn, setEditBioEn] = useState(currentBroker?.bioEn || '');
  const [editBioBn, setEditBioBn] = useState(currentBroker?.bioBn || '');
  const [editDivision, setEditDivision] = useState(currentBroker?.location?.division || 'Dhaka');
  const [editDistrict, setEditDistrict] = useState(currentBroker?.location?.district || 'Dhaka');
  const [editUpazila, setEditUpazila] = useState(currentBroker?.location?.upazila || 'Mirpur');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  if (!user || role !== 'broker') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          This portal is strictly reserved for Broker Agency accounts. You are currently logged in as <strong className="text-emerald-400 uppercase">{role || 'Guest'}</strong>.
        </p>
        <Link href={user ? `/dashboard/${role}` : '/auth/login'} className="inline-block py-2.5 px-6 rounded-xl gradient-bg text-white font-bold text-xs">
          Go to My Authorized Dashboard ({role?.toUpperCase() || 'LOGIN'})
        </Link>
      </div>
    );
  }

  const isRestricted = currentBroker.status === 'restricted';
  const isWarned = currentBroker.status === 'warned';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isRestricted) return;

    addWorker(currentBroker.id, {
      name,
      category,
      dailyRate,
      hourlyRate: Math.round(dailyRate / 7),
      experienceYears: exp,
      available: true,
      rating: 4.8
    });

    setName('');
    setIsAddOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrokerProfile(currentBroker.id, {
      name: editName,
      nameBn: editNameBn,
      phone: editPhone,
      email: editEmail,
      bioEn: editBioEn,
      bioBn: editBioBn,
      location: {
        division: editDivision as any,
        district: editDistrict,
        upazila: editUpazila
      }
    });

    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Broker Agency Portal
            </span>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              isRestricted
                ? 'bg-rose-950 text-rose-400 border border-rose-600/40'
                : isWarned
                ? 'bg-amber-950 text-amber-400 border border-amber-600/40'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
            }`}>
              Status: {currentBroker.status}
            </span>
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{currentBroker.name}</span>
            <Link
              href={`/brokers/${currentBroker.id}`}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/40"
            >
              <span>Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </h1>
          <p className="text-xs text-slate-400">
            Location: {currentBroker.location.division} ({currentBroker.location.district} - {currentBroker.location.upazila})
          </p>
        </div>

        {/* Tab Toggle Controls */}
        <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Requests ({brokerBookings.filter(b => b.status === 'Pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'workers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Workers ({currentBroker.workers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Agency Profile</span>
          </button>

          {/* RULES & REGULATIONS TAB (REQ: BROKER RULES & REGULATIONS SETTINGS) */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Rules & Regulations</span>
          </button>
        </div>
      </div>

      {/* VERIFICATION ACHIEVEMENT TRACKER CARD (REQ: ACHIEVEMENT-BASED VERIFIED BADGE) */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg ${
            currentBroker.verified
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950'
              : 'bg-amber-950 text-amber-400 border border-amber-500/40'
          }`}>
            <Award className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                currentBroker.verified
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600/40'
                  : 'bg-amber-950 text-amber-300 border-amber-600/40'
              }`}>
                {currentBroker.verified ? '✓ Official Verified Agency' : '🏆 Verification Achievement Status: Pending'}
              </span>
            </div>

            <h3 className="text-sm font-black text-white mt-0.5">
              {currentBroker.verified
                ? 'Verified Badge Active on Public Marketplace'
                : 'Complete Achievements to Unlock Official Verified Badge'}
            </h3>
          </div>
        </div>

        {/* Verification Requirements Checklist */}
        {!currentBroker.verified ? (
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className={(currentBroker.totalJobsCompleted || 0) >= 5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {(currentBroker.totalJobsCompleted || 0) >= 5 ? '✓' : '○'} 5 Jobs ({currentBroker.totalJobsCompleted || 0}/5)
              </span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <span className={(currentBroker.ratingAvg || 4.8) >= 4.5 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {(currentBroker.ratingAvg || 4.8) >= 4.5 ? '✓' : '○'} 4.5+ Rating ({currentBroker.ratingAvg || 4.8})
              </span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <span className={(currentBroker.workers?.length || 0) >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {(currentBroker.workers?.length || 0) >= 3 ? '✓' : '○'} 3 Workers ({currentBroker.workers?.length || 0}/3)
              </span>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-600/40 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Achievement Unlocked (100% Verified)</span>
          </div>
        )}
      </div>

      {/* ADMIN WARNING BANNER IF FLAGGED */}
      {isWarned && currentBroker.warningMessage && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/60 text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Official Admin Warning Issued</span>
          </div>
          <p className="leading-relaxed">
            "{currentBroker.warningMessage}"
          </p>
        </div>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('managedWorkers')}
          </div>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span>{currentBroker.workers.length}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('incomingRequests')}
          </div>
          <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            <span>{brokerBookings.filter(b => b.status === 'Pending').length}</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            {t('totalEarnings')}
          </div>
          <div className="text-2xl font-black text-teal-400 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            <span>৳{currentBroker.totalJobsCompleted * 1200}</span>
          </div>
        </div>
      </div>

      {/* TAB 1: INCOMING BOOKING REQUESTS & ADMIN PAYMENT PIPELINE */}
      {activeTab === 'requests' && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <span>Incoming Customer Booking Orders ({brokerBookings.length})</span>
          </h2>

          {brokerBookings.length > 0 ? (
            <div className="space-y-4">
              {brokerBookings.map((b) => (
                <div key={b.id} className="glass-panel bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Customer: {b.customerName} ({b.customerPhone})
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>
                          Services Needed: <strong className="text-emerald-400">{b.serviceCategories ? b.serviceCategories.join(', ') : b.serviceCategory}</strong> ({b.workersCount} Workers)
                        </span>
                        <span>• Date: {b.workDate}</span>
                      </p>
                    </div>

                    {/* SCENARIO A: Broker confirms deal & refunds ৳500 to customer */}
                    {b.status === 'Pending' ? (
                      <button
                        disabled={isRestricted}
                        onClick={() => confirmBookingByBroker(b.id)}
                        className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                          isRestricted
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'gradient-bg hover:opacity-90'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Deal & Refund ৳500 Deposit to Customer</span>
                      </button>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        b.status === 'Cancelled'
                          ? 'bg-rose-950 text-rose-300 border-rose-600/40'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-600/40'
                      }`}>
                        {b.status === 'Cancelled' 
                          ? 'Cancelled (Customer Requested ৳500 Refund from Labour.com)' 
                          : 'Deal Confirmed (৳500 Refunded to Customer)'}
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 text-xs text-slate-300">
                    <strong>Worksite Address:</strong> {b.address} <br />
                    <strong>Instructions:</strong> "{b.details}"
                  </div>

                  {/* ADMIN PAYMENT REQUEST PIPELINE (REQ 3) */}
                  {b.status === 'Confirmed' && (
                    <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-200">Customer Agreed Job Rate:</span>
                        <span className="text-emerald-400 font-extrabold text-sm">
                          {b.customAgreedAmount ? `৳${b.customAgreedAmount} BDT` : 'Awaiting customer input'}
                        </span>
                      </div>

                      {b.customAgreedAmount && (
                        <div>
                          {b.paymentRequestStatus === 'NotRequested' && (
                            <button
                              onClick={() => requestPaymentByBroker(b.id)}
                              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Send className="w-4 h-4" />
                              <span>Submit Payment Request (৳{b.customAgreedAmount}) to Labour.com Admin</span>
                            </button>
                          )}

                          {b.paymentRequestStatus === 'RequestedToAdmin' && (
                            <div className="p-2 rounded-lg bg-blue-950 text-blue-300 text-[11px] font-bold text-center border border-blue-600/40">
                              Payment Request (৳{b.customAgreedAmount}) Submitted to Admin. Awaiting Admin Approval...
                            </div>
                          )}

                          {b.paymentRequestStatus === 'ApprovedByAdmin' && (
                            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 text-[11px] font-bold text-center border border-emerald-600/40">
                              Admin Approved Payment Request! Customer is prompted to deposit ৳{b.customAgreedAmount} into Escrow.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* BROKER WORK COMPLETION HANDOVER SUBMISSION */}
                  {b.status === 'Confirmed' && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Step 1: Broker Work Handover Notice (কাজ বুঝিয়ে দেওয়ার নোটিশ)</span>
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {b.brokerWorkDoneStatus === 'Requested' ? '✓ Notice Sent to Admin' : 'Work Delivered'}
                        </span>
                      </div>

                      {b.brokerWorkDoneStatus !== 'Requested' ? (
                        <button
                          onClick={() => submitBrokerWorkDone(b.id)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark Work Delivered & Request Work Completion (গ্রাহককে কাজ বুঝিয়ে দিন)</span>
                        </button>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-300 font-bold text-center border border-emerald-600/40 space-y-1">
                          <div className="flex items-center justify-center gap-1.5 text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Work Handover Notice Submitted to Master Admin & Customer!</span>
                          </div>
                          <p className="text-[10px] text-slate-300 font-normal">
                            Once customer submits work verification rating & comment, Admin will release worker payout to your agency.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No incoming booking requests currently.
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MANAGED WORKERS CATALOG */}
      {activeTab === 'workers' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{t('managedWorkers')} ({currentBroker.workers.length})</span>
            </h2>

            <button
              disabled={isRestricted}
              onClick={() => setIsAddOpen(true)}
              className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
                isRestricted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'gradient-bg hover:opacity-90'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{t('addWorkerBtn')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBroker.workers.map((w) => (
              <div key={w.id} className="relative group">
                <WorkerCard worker={w} />
                {!isRestricted && (
                  <button
                    onClick={() => deleteWorker(currentBroker.id, w.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-600/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-900"
                    title="Remove worker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: AGENCY PROFILE EDITING PORTAL */}
      {activeTab === 'profile' && (
        <section className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-400" />
                <span>Agency Profile Editor & Information Management</span>
              </h2>
            </div>

            <Link
              href={`/brokers/${currentBroker.id}`}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span>View Live Public Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </Link>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Broker Agency Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Agency Name in Bangla
                </label>
                <input
                  type="text"
                  value={editNameBn}
                  onChange={(e) => setEditNameBn(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRestricted}
              className="w-full py-3.5 rounded-2xl gradient-bg text-white font-extrabold text-xs shadow-xl hover:opacity-90 transition-all"
            >
              Save Agency Profile Changes
            </button>
          </form>
        </section>
      )}

      {/* TAB 4: BROKER RULES & REGULATIONS SETTINGS & POLICY CENTER (DYNAMIC BILINGUAL CONVERSION) */}
      {activeTab === 'rules' && (
        <section className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
              {language === 'bn' ? 'প্ল্যাটফর্ম গাইডলাইন ও পলিসি' : 'Platform Compliance & Governance'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span>
                {language === 'bn' ? 'ব্রোকার নিয়মাবলী ও পরিচালন নীতি' : 'Broker Rules & Operational Regulations'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'কাস্টমার কলিং, ৳৫০০ রিফান্ড নিয়ম, ব্যাজ অর্জন ও অ্যাকাউন্ট নিরাপত্তার অফিসিয়াল নির্দেশনা'
                : 'Official policies for customer contact, ৳500 deposit refund compliance, verification achievements & account safety'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            
            {/* Rule 1: ৳500 Deposit & 24h Contact */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>
                  {language === 'bn'
                    ? '১. ৳৫০০ অগ্রিম রিফান্ড ও ২৪ ঘণ্টার কলিং নিয়ম'
                    : '1. ৳500 Advance Refund & 24h Contact Rule'}
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                {language === 'bn' ? (
                  <>
                    • বুকিং পাওয়ার <strong>২৪ ঘণ্টার মধ্যে</strong> ব্রোকারকে অবশ্যই কাস্টমারকে কল দিতে হবে। <br />
                    • কথা বলে চুক্তি চূড়ান্ত হলে <strong>"Confirm Deal & Refund ৳500 Deposit"</strong> বাটনে ক্লিক করে রিফান্ড দিন। <br />
                    • কাস্টমার ডিল রিজেক্ট করলে লেবার.কম প্ল্যাটফর্ম সরাসরি রিফান্ড ইস্যু করবে।
                  </>
                ) : (
                  <>
                    • The broker must call the customer <strong>within 24 hours</strong> of receiving a booking order. <br />
                    • Once job terms are agreed, click <strong>"Confirm Deal & Refund ৳500 Deposit"</strong> to process refund. <br />
                    • If customer rejects the deal, Labour.com platform issues the ৳500 refund directly.
                  </>
                )}
              </p>
            </div>

            {/* Rule 2: Escrow Payout Security */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-extrabold text-sm text-teal-400 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-400" />
                <span>
                  {language === 'bn'
                    ? '২. এসক্রো পেমেন্ট ও পেআউট নিরাপত্তা'
                    : '2. Escrow Payment & Payout Security'}
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                {language === 'bn' ? (
                  <>
                    • কাস্টমার ফোন করে চূড়ান্ত মজুরি ঠিক করার পর ড্যাশবোর্ডে পরিমাণ সেভ করবেন। <br />
                    • ব্রোকার <strong>"Submit Payment Request to Admin"</strong> এ ক্লিক করবেন। এডমিন এপ্রুভ করলে কাস্টমার এসক্রোতে জমা দিবেন। <br />
                    • কাজ শতভাগ সম্পন্ন হলে কাস্টমার কনফার্ম করার সাথে সাথে পেআউট ব্রোকারের নিকট রিলিজ হবে।
                  </>
                ) : (
                  <>
                    • Customer saves the negotiated rate on their dashboard after phone confirmation. <br />
                    • Broker clicks <strong>"Submit Payment Request to Admin"</strong>. Upon Admin approval, customer deposits into Escrow. <br />
                    • Funds are released to the broker immediately after customer confirms job completion.
                  </>
                )}
              </p>
            </div>

            {/* Rule 3: Achievement Verification Criteria */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>
                  {language === 'bn'
                    ? '৩. ভেরিফাইড ব্রোকার ব্যাজ অর্জনের নিয়মাবলী'
                    : '3. Verified Agency Badge Achievement Rules'}
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                {language === 'bn' ? (
                  <>
                    • নতুন নিবন্ধিত সব ব্রোকার শুরুতেই ভেরিফাইড থাকে না। <strong>Verified Agency Badge</strong> পেতে ৩টি লক্ষ্য পূরণ করতে হবে: <br />
                    • <strong>অর্জন ১:</strong> সর্বনিম্ন ৫টি গ্রাহক জব সফলভাবে শেষ করতে হবে। <br />
                    • <strong>অর্জন ২:</strong> গ্রাহক রেটিং ৪.৫+ বজায় রাখতে হবে। <br />
                    • <strong>অর্জন ৩:</strong> ক্যাটালগে অন্তত ৩ জন সক্রিয় শ্রমিক থাকতে হবে।
                  </>
                ) : (
                  <>
                    • Not all brokers start verified. Unlocking the <strong>Verified Agency Badge</strong> requires fulfilling 3 milestones: <br />
                    • <strong>Milestone 1:</strong> Complete a minimum of 5 customer job orders. <br />
                    • <strong>Milestone 2:</strong> Maintain a 4.5+ average client rating. <br />
                    • <strong>Milestone 3:</strong> Maintain at least 3 active workers in agency catalog.
                  </>
                )}
              </p>
            </div>

            {/* Rule 4: Warnings & Restriction Policy */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="font-extrabold text-sm text-rose-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>
                  {language === 'bn'
                    ? '৪. অফ-প্ল্যাটফর্ম বাইপাস লেনদেন ও পেনাল্টি নীতি'
                    : '4. Off-Platform Bypass & Account Restriction Policy'}
                </span>
              </div>
              <p className="leading-relaxed text-slate-300">
                {language === 'bn' ? (
                  <>
                    • প্ল্যাটফর্মের বাইরে সরাসরি ক্যাশ বাইপাসের চেষ্টা এআই ফ্রড গার্ডে ধরা পড়লে এডমিন ওয়ার্নিং নোটিশ ইস্যু করবে। <br />
                    • একাধিক ওয়ার্নিং পেলে ব্রোকার অ্যাকাউন্ট সাময়িকভাবে রিক্ট্রিক্টেড (Restricted) করা হবে এবং নতুন বুকিং বন্ধ থাকবে।
                  </>
                ) : (
                  <>
                    • Direct off-platform cash bypass attempts flagged by AI Fraud Guard will trigger official admin warnings. <br />
                    • Receiving multiple warnings will cause the broker account to be restricted, pausing incoming bookings.
                  </>
                )}
              </p>
            </div>

          </div>
        </section>
      )}

      {/* ADD NEW WORKER MODAL (FIX FOR "+ Add New Worker" BUTTON) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 relative space-y-6 shadow-2xl">
            
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-700/40">
                Managed Workforce Catalog
              </span>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                Add New Skilled Worker
              </h3>
              <p className="text-xs text-slate-400">
                Register a new electrician, plumber, mason, driver or labourer under {currentBroker.name}
              </p>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Worker Full Name (নাম)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ismail Hossain"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Service Skill Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white capitalize"
                  >
                    <option value="Labourer">General Labourer</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Mason">Mason</option>
                    <option value="Driver">Driver</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Painter">Painter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Daily Wage Rate (৳ BDT)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={50}
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Work Experience (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={exp}
                  onChange={(e) => setExp(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl gradient-bg text-white font-extrabold text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Worker</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
