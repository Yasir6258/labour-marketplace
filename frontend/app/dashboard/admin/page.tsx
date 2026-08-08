'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { analyzeBookingAIFraudRisk, AIFraudAnalysisResult } from '@/lib/ai/aiFraudGuard';
import { DepositMode, BrokerProfile, Booking } from '@/lib/types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Check, 
  Building2, 
  MapPin, 
  Settings, 
  AlertTriangle, 
  Ban, 
  Search, 
  X,
  CreditCard,
  History,
  Lock,
  Activity,
  CheckCircle2,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { role, user } = useAuth();
  const { 
    brokers, 
    bookings, 
    issueWarning, 
    restrictAccount, 
    unrestrictAccount,
    approvePaymentRequestByAdmin,
    releaseEscrowPayoutByAdmin
  } = useData();

  // All React Hooks declared at top before any early returns (Rules of Hooks)
  const [activeSection, setActiveSection] = useState<'workdone' | 'financials' | 'brokers' | 'customers' | 'audit'>('workdone');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrokerForWarning, setSelectedBrokerForWarning] = useState<BrokerProfile | null>(null);
  const [selectedBookingForAIRisk, setSelectedBookingForAIRisk] = useState<{ booking: Booking; aiResult: AIFraudAnalysisResult } | null>(null);
  const [warningReason, setWarningReason] = useState('');

  const [auditLogs, setAuditLogs] = useState<{ id: string; action: string; target: string; time: string }[]>([
    { id: 'log_1', action: 'Account Verified', target: 'Mirpur Labour & Technical Service', time: '1 hour ago' },
    { id: 'log_2', action: 'Escrow Payout Released (৳1150)', target: 'Chattogram Port Electrical & Wood Works', time: '3 hours ago' }
  ]);

  if (!user || role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-panel bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          This portal is strictly reserved for Platform Master Admin accounts. You are currently logged in as <strong className="text-emerald-400 uppercase">{role || 'Guest'}</strong>.
        </p>
        <Link href={user ? `/dashboard/${role}` : '/auth/login'} className="inline-block py-2.5 px-6 rounded-xl gradient-bg text-white font-bold text-xs">
          Go to My Authorized Dashboard ({role?.toUpperCase() || 'LOGIN'})
        </Link>
      </div>
    );
  }

  const totalWorkers = brokers.reduce((acc, b) => acc + b.workers.length, 0);
  const totalEscrowVolume = bookings.reduce((acc, b) => acc + (b.customAgreedAmount || b.finalAmount || 3500) + 500, 0);
  const totalHeldEscrow = bookings.filter(b => b.escrowStatus !== 'ReleasedToBroker').reduce((acc, b) => acc + (b.customAgreedAmount || b.finalAmount || 3500) + 500, 0);
  const totalPlatformProfit = bookings.filter(b => b.status === 'Completed' || b.escrowStatus === 'ReleasedToBroker').length * 500;

  const filteredBrokers = brokers.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone.includes(searchTerm)
  );

  const handleSendWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrokerForWarning || !warningReason.trim()) return;

    issueWarning(selectedBrokerForWarning.id, warningReason);

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        action: `Issued Official Warning: "${warningReason}"`,
        target: selectedBrokerForWarning.name,
        time: 'Just now'
      },
      ...auditLogs
    ]);

    setSelectedBrokerForWarning(null);
    setWarningReason('');
  };

  const handleToggleRestriction = (broker: BrokerProfile) => {
    if (broker.status === 'restricted') {
      unrestrictAccount(broker.id);
      setAuditLogs([
        { id: `log_${Date.now()}`, action: 'Restored Account Access', target: broker.name, time: 'Just now' },
        ...auditLogs
      ]);
    } else {
      restrictAccount(broker.id);
      setAuditLogs([
        { id: `log_${Date.now()}`, action: 'Suspended & Restricted Account', target: broker.name, time: 'Just now' },
        ...auditLogs
      ]);
    }
  };

  const handleApprovePaymentRequest = (bookingId: string, amount: number) => {
    approvePaymentRequestByAdmin(bookingId);
    setAuditLogs([
      { id: `log_${Date.now()}`, action: `Approved Customer Payment Request (৳${amount})`, target: bookingId, time: 'Just now' },
      ...auditLogs
    ]);
  };

  // Regional breakdown
  const divisions = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'];
  const divisionCounts = divisions.map(div => ({
    name: div,
    count: brokers.filter(b => b.location.division === div).length
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ENTERPRISE SAAS HEADER */}
      <div className="glass-panel bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xl shadow-lg shadow-rose-950">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-700/40">
                Enterprise Admin SaaS Control Center
              </span>
              <span className="text-xs text-slate-400">Bangladesh Master Server</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Labour.com Executive Command Console
            </h1>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { id: 'workdone', label: 'Dual Work Approvals & Payment', icon: CheckCircle2 },
            { id: 'financials', label: 'Financials & Escrow', icon: DollarSign },
            { id: 'brokers', label: 'Broker Moderation', icon: Building2 },
            { id: 'customers', label: 'Customers Database', icon: Users },
            { id: 'audit', label: 'Audit Trail', icon: History }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSection === tab.id
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* EXECUTIVE KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Total Escrow Processed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">৳{totalEscrowVolume} BDT</div>
          <div className="text-[10px] text-slate-400">Secured across Bangladesh</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Escrow Funds Held</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">৳{totalHeldEscrow} BDT</div>
          <div className="text-[10px] text-slate-400">Awaiting job completion payout</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Broker Agencies</span>
            <Building2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-400">{brokers.length} Agencies</div>
          <div className="text-[10px] text-slate-400">Across 8 Divisions</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Managed Workforce Pool</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400">{totalWorkers} Workers</div>
          <div className="text-[10px] text-slate-400">Electricians, Plumbers & Masons</div>
        </div>
      </div>

      {/* SECTION 0: DUAL WORK APPROVALS & PAYMENT */}
      {activeSection === 'workdone' && (
        <div className="space-y-6">
          <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            
            {/* Clean Section Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700/40 inline-flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Dual Verification Control
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Dual Work Approvals & Payment
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Approve dual completion requests from Broker & Customer to disburse broker payouts and retain platform net profit.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Platform Profit / Order</span>
                <strong className="text-amber-300 font-black text-lg">৳500 BDT Net Profit</strong>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {bookings.length > 0 ? (
                bookings.map((b) => {
                  const agreedAmount = b.customAgreedAmount || b.finalAmount || 3500;
                  const totalDeposited = agreedAmount + 500;
                  const isBrokerDone = b.brokerWorkDoneStatus === 'Requested';
                  const isCustomerDone = b.customerWorkDoneStatus === 'Confirmed';
                  const isFullyCompleted = b.status === 'Completed' || b.escrowStatus === 'ReleasedToBroker';

                  return (
                    <div key={b.id} className="glass-panel bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
                      
                      {/* Order Top Bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-black text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-700/40">
                              Order #{b.id}
                            </span>
                            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isFullyCompleted
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                                : (isBrokerDone && isCustomerDone)
                                ? 'bg-teal-950 text-teal-300 border border-teal-600/50 animate-pulse'
                                : isBrokerDone
                                ? 'bg-blue-950 text-blue-300 border border-blue-600/50'
                                : 'bg-amber-950 text-amber-300 border border-amber-600/50'
                            }`}>
                              {isFullyCompleted 
                                ? '✓ Escrow Disbursed' 
                                : (isBrokerDone && isCustomerDone)
                                ? '🟢 Ready for Payout Release'
                                : isBrokerDone
                                ? '🔵 Broker Delivered, Awaiting Customer'
                                : '🟡 Awaiting Confirmation'}
                            </span>
                          </div>

                          <h3 className="text-lg font-black text-white flex items-center gap-2">
                            <span>Customer: <strong className="text-slate-100">{b.customerName}</strong> ({b.customerPhone})</span>
                            <span className="text-slate-600">➔</span>
                            <span>Broker: <strong className="text-emerald-400">{b.brokerName}</strong></span>
                          </h3>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Services Requested</span>
                          <span className="text-xs font-bold text-white">
                            {b.serviceCategories ? b.serviceCategories.join(', ') : b.serviceCategory} ({b.workersCount} Workers)
                          </span>
                        </div>
                      </div>

                      {/* 2-STEP VISUAL WORKFLOW CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* STEP 1: BROKER DELIVERY CARD */}
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isBrokerDone
                            ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/50 shadow-md shadow-emerald-950'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isBrokerDone ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                              }`}>
                                👷
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-white">1. Broker Work Delivery</h4>
                                <span className="text-[10px] text-slate-400">Broker Handover Status</span>
                              </div>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                              isBrokerDone ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isBrokerDone ? '✓ Handed Over' : '⏳ Pending'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {isBrokerDone 
                              ? '✓ Broker agency has submitted official work handover notice.' 
                              : 'Broker agency has not handed over work completion notice yet.'}
                          </p>
                        </div>

                        {/* STEP 2: CUSTOMER APPROVAL CARD */}
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isCustomerDone
                            ? 'bg-gradient-to-r from-teal-950/80 to-slate-900 border-teal-500/50 shadow-md shadow-teal-950'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isCustomerDone ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
                              }`}>
                                👤
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-white">2. Customer Approval</h4>
                                <span className="text-[10px] text-slate-400">Inspection & Review</span>
                              </div>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                              isCustomerDone ? 'bg-teal-900 text-teal-300' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isCustomerDone ? `✓ Rated (${b.customerRating}★)` : '⏳ Pending'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {isCustomerDone 
                              ? `✓ Customer inspected & confirmed: "${b.customerComment}"` 
                              : 'Customer has not inspected & rated job completion yet.'}
                          </p>
                        </div>
                      </div>

                      {/* ULTRA-CLEAN 3-STEP FINANCIAL MATH BAR */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                          <span className="font-bold text-slate-300 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span>Financial Escrow Disburse Breakdown</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Net Calculation</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[9px] font-bold text-slate-400 uppercase block">Customer Escrow Deposit</span>
                            <strong className="text-white font-black text-sm block">৳{totalDeposited} BDT</strong>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                            <span className="text-[9px] font-bold text-emerald-400 uppercase block">Disbursed to Broker Agency</span>
                            <strong className="text-emerald-400 font-black text-sm block">৳{agreedAmount} BDT</strong>
                          </div>

                          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-600/40">
                            <span className="text-[9px] font-extrabold text-amber-300 uppercase block">Labour.com Net Profit</span>
                            <strong className="text-amber-300 font-black text-sm block">৳500 BDT Profit</strong>
                          </div>
                        </div>

                        {/* DISBURSE ACTION BUTTON WITH STRICT DUAL LOCK */}
                        {isFullyCompleted ? (
                          <div className="p-3 rounded-xl bg-emerald-950 text-emerald-300 font-extrabold text-xs text-center border border-emerald-600/40 flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>✓ Payout Released • Broker Agency Received ৳{agreedAmount} | Labour.com Profit ৳500 BDT</span>
                          </div>
                        ) : isBrokerDone && isCustomerDone ? (
                          <button
                            onClick={() => releaseEscrowPayoutByAdmin(b.id)}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:scale-[1.01] transition-all text-white font-black text-xs shadow-xl flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4 text-white" />
                            <span>⚡ Both Confirmations Received! Disburse ৳{agreedAmount} to Broker (Labour.com Profit: ৳500 BDT)</span>
                          </button>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-600/50 text-amber-300 font-extrabold text-xs text-center space-y-1">
                            <div className="flex items-center justify-center gap-2 text-rose-400">
                              <Lock className="w-4 h-4 text-rose-400" />
                              <span>🔒 Payment Release Locked: Both Broker & Customer Work Done Requests Required</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-normal">
                              {!isBrokerDone && !isCustomerDone 
                                ? 'Waiting for both Broker handover notice AND Customer inspection rating.' 
                                : !isBrokerDone 
                                ? 'Waiting for Broker handover notice submission.' 
                                : 'Waiting for Customer inspection rating submission.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-xs">
                  No work done requests currently.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: FINANCIALS & LIVE ESCROW LEDGER (STRICTLY AUDIT ONLY) */}
      {activeSection === 'financials' && (
        <div className="space-y-6">
          <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Marketplace Escrow Financial Audit Ledger</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time transaction tracking & ৳500 platform net profit audit. <strong className="text-amber-400">Note: Escrow Payout Releases are strictly processed from the 'Dual Work Approvals & Payment' tab.</strong>
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-600/40">
                Audit Gateway: Synchronized Live
              </span>
            </div>

            {/* Escrow Audit Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Assigned Broker</th>
                    <th className="p-3">Labor Rate (Broker)</th>
                    <th className="p-3">Customer Escrow Total</th>
                    <th className="p-3">Labour.com Profit</th>
                    <th className="p-3">AI Fraud Risk</th>
                    <th className="p-3 text-right">Audit Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {bookings.map((b) => {
                    const agreedRate = b.customAgreedAmount || b.finalAmount || 3500;
                    const totalCustomerPaid = agreedRate + 500;
                    const aiRisk = analyzeBookingAIFraudRisk(b.details, b.finalAmount);
                    const isDisbursed = b.status === 'Completed' || b.escrowStatus === 'ReleasedToBroker';

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-200">{b.id}</td>
                        <td className="p-3 font-bold text-white">{b.customerName}</td>
                        <td className="p-3 text-emerald-400 font-semibold">{b.brokerName}</td>
                        <td className="p-3 font-bold text-emerald-300">৳{agreedRate} BDT</td>
                        <td className="p-3 font-black text-white">৳{totalCustomerPaid} BDT</td>
                        <td className="p-3 font-black text-amber-300">৳500 BDT Net Profit</td>
                        
                        {/* AI FRAUD RISK BADGE COLUMN */}
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedBookingForAIRisk({ booking: b, aiResult: aiRisk })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all border ${
                              aiRisk.riskLevel === 'High'
                                ? 'bg-rose-950 text-rose-300 border-rose-600/50 shadow-md shadow-rose-950 animate-pulse'
                                : aiRisk.riskLevel === 'Medium'
                                ? 'bg-amber-950 text-amber-300 border-amber-600/40'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-600/40'
                            }`}
                            title="Click to view AI Fraud Guard Analysis"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>AI Risk: {aiRisk.riskScore}% ({aiRisk.riskLevel})</span>
                          </button>
                        </td>

                        {/* AUDIT ESCROW STATUS (STRICTLY AUDIT ONLY, NO RELEASE BUTTON HERE) */}
                        <td className="p-3 text-right">
                          {isDisbursed ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-[10px] font-black inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>✓ Payout Disbursed (Broker: ৳{agreedRate} | Profit: ৳500)</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => setActiveSection('workdone')}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 border border-amber-600/40 text-[10px] font-bold inline-flex items-center gap-1 hover:border-amber-400 transition-colors"
                            >
                              <Lock className="w-3.5 h-3.5 text-amber-400" />
                              <span>🔒 Escrow Vault Held (Release in Dual Tab ➔)</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: BROKER AGENCY MODERATION */}
      {activeSection === 'brokers' && (
        <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-rose-400" />
                <span>Broker Agency Moderation & Restriction Console</span>
              </h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search brokers by name/district..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-700">
                <tr>
                  <th className="p-3">Agency Name</th>
                  <th className="p-3">Division & District</th>
                  <th className="p-3">Phone / Contact</th>
                  <th className="p-3">Workforce</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBrokers.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-white">{b.name}</td>
                    <td className="p-3">{b.location.division} ({b.location.district})</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3 font-bold text-emerald-400">{b.workers.length} Workers</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === 'restricted'
                          ? 'bg-rose-950 text-rose-400 border border-rose-600/40'
                          : b.status === 'warned'
                          ? 'bg-amber-950 text-amber-400 border border-amber-600/40'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedBrokerForWarning(b)}
                        className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-600/40 font-bold text-[11px]"
                      >
                        Issue Warning
                      </button>

                      <button
                        onClick={() => handleToggleRestriction(b)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                          b.status === 'restricted'
                            ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40'
                            : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-600/40'
                        }`}
                      >
                        {b.status === 'restricted' ? 'Restore Account' : 'Restrict Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: CUSTOMER USER DATABASE */}
      {activeSection === 'customers' && (
        <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Registered Customer Directory</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-700">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Phone Number</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Total Bookings</th>
                  <th className="p-3">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-white">Tanvir Hossain</td>
                  <td className="p-3">+880 1700-112233</td>
                  <td className="p-3">Dhaka (Mirpur)</td>
                  <td className="p-3 font-bold text-emerald-400">2 Bookings</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/40">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: AUDIT TRAIL */}
      {activeSection === 'audit' && (
        <div className="glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Admin System Audit Trail</span>
          </h2>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <div>
                    <strong className="text-white">{log.action}</strong>
                    <span className="text-slate-400 block text-[11px]">Target: {log.target}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISSUE WARNING MODAL */}
      {selectedBrokerForWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-2xl p-6 relative">
            <button
              onClick={() => setSelectedBrokerForWarning(null)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Issue Official Warning</span>
            </h3>

            <form onSubmit={handleSendWarning} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Warning Reason
                </label>
                <textarea
                  rows={3}
                  value={warningReason}
                  onChange={(e) => setWarningReason(e.target.value)}
                  placeholder="Reason..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
              >
                Send Warning Notice
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI FRAUD RISK INSPECTION MODAL */}
      {selectedBookingForAIRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-2xl p-6 relative space-y-4">
            <button
              onClick={() => setSelectedBookingForAIRisk(null)}
              className="absolute top-4 right-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>AI Off-Platform Bypass Risk Report</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">TxID: {selectedBookingForAIRisk.booking.id}</span>
                <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                  selectedBookingForAIRisk.aiResult.riskLevel === 'High'
                    ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                }`}>
                  Risk: {selectedBookingForAIRisk.aiResult.riskScore}% ({selectedBookingForAIRisk.aiResult.riskLevel})
                </span>
              </div>

              <div className="text-slate-300 font-medium">
                <strong>Details Text:</strong> "{selectedBookingForAIRisk.booking.details}"
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-300 block">AI Detected Risk Factors:</span>
              <ul className="list-disc list-inside text-amber-300 space-y-1">
                {selectedBookingForAIRisk.aiResult.detectedFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/90 text-xs text-slate-300 border border-slate-700 leading-relaxed">
              <strong>AI Recommendation:</strong> {selectedBookingForAIRisk.aiResult.recommendationEn}
            </div>

            <button
              onClick={() => setSelectedBookingForAIRisk(null)}
              className="w-full py-2.5 rounded-xl gradient-bg text-white font-bold text-xs"
            >
              Close AI Risk Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
