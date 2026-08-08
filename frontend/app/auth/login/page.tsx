'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { UserRole } from '@/lib/types';
import { BANGLADESH_LOCATIONS } from '@/lib/data/bangladesh-locations';
import { 
  Briefcase, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  User, 
  ShieldAlert,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  Building2,
  Users
} from 'lucide-react';

export default function LoginPage() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const { addBrokerAgency } = useData();
  const router = useRouter();

  // AUTH MODE: 'login' OR 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // LOGIN STATE
  const [activeLoginRole, setActiveLoginRole] = useState<UserRole>('customer');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);

  // REGISTER STATE (REQ: IMMEDIATELY CREATE CUSTOMER & BROKER ACCOUNT)
  const [regRole, setRegRole] = useState<'customer' | 'broker'>('customer');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('01700123456');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [regDivision, setRegDivision] = useState('Dhaka');
  const [regDistrict, setRegDistrict] = useState('Dhaka');
  const [regUpazila, setRegUpazila] = useState('Mirpur');
  const [regWorkerCount, setRegWorkerCount] = useState(5);

  const handleLoginSubmit = (roleInput: UserRole, targetEmail?: string, targetPass?: string) => {
    setAdminAuthError(null);
    const emailToValidate = targetEmail || loginEmail || (roleInput === 'admin' ? 'admin6258@labour.com' : `${roleInput}@labour.com`);
    const passwordToValidate = targetPass || loginPassword || (roleInput === 'admin' ? 'adminpass6258#' : 'password123');

    // SECRET ADMIN AUTHORIZATION SECURITY CHECK
    if (roleInput === 'admin') {
      const emailUsername = emailToValidate.split('@')[0] || '';
      const emailValid = emailUsername.endsWith('6258');
      const passValid = passwordToValidate.endsWith('6258#');

      if (!emailValid || !passValid) {
        setAdminAuthError(
          language === 'bn'
            ? '❌ সিপাহী/এডমিন সিক্রেট অথরাইজেশন ব্যর্থ! জিমেইল এর @ এর ঠিক পূর্বে "6258" থাকতে হবে এবং পাসওয়ার্ডের শেষে "6258#" থাকতে হবে।'
            : '❌ Secret Admin Authorization Failed! Email username before @ must end with "6258" (e.g. admin6258@labour.com) and Password must end with "6258#".'
        );
        return;
      }
    }

    login(emailToValidate, roleInput);

    if (roleInput === 'customer') {
      router.push('/dashboard/customer');
    } else if (roleInput === 'broker') {
      router.push('/dashboard/broker');
    } else if (roleInput === 'admin') {
      router.push('/dashboard/admin');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    const email = regEmail || `${regRole}_${Date.now()}@labour.com`;

    if (regRole === 'broker') {
      // Create new broker agency in DataContext
      addBrokerAgency({
        name: regName,
        phone: regPhone,
        email,
        division: regDivision,
        district: regDistrict,
        upazila: regUpazila,
        servicesOffered: ['Labourer', 'Electrician', 'Plumber', 'Mason', 'Driver'],
        workerCount: regWorkerCount
      });
    }

    // Immediately log in user and redirect to dashboard
    login(email, regRole, regName, regPhone, { division: regDivision, district: regDistrict, upazila: regUpazila });
    router.push(`/dashboard/${regRole}`);
  };

  const districtsForDivision = BANGLADESH_LOCATIONS.find(l => l.division === regDivision)?.districts || ['Dhaka'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-950">
            <Briefcase className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'bn' ? 'লেবার.কম পোর্টালএক্সেস' : 'Labour.com Auth Portal'}
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {language === 'bn'
              ? 'লগইন করুন অথবা তাৎক্ষণিকভাবে নতুন অ্যাকাউন্ট তৈরি করুন'
              : 'Sign in to your authorized portal or register a new account immediately'}
          </p>
        </div>

        {/* SIDE-BY-SIDE AUTH MODE SWITCHER (LOGIN VS CREATE ACCOUNT) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'gradient-bg text-white shadow-lg shadow-emerald-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগইন (Sign In)' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`py-3 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{language === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create New Account'}</span>
          </button>
        </div>

        {/* =============================================================== */}
        {/* MODE 1: LOGIN PORTAL */}
        {/* =============================================================== */}
        {authMode === 'login' ? (
          <div className="space-y-6">
            
            {/* 3 Role Tabs */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Portal Type
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('customer');
                    setLoginEmail('tanvir@gmail.com');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeLoginRole === 'customer'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('broker');
                    setLoginEmail('mirpur.broker@labour.com');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeLoginRole === 'broker'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Broker</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveLoginRole('admin');
                    setLoginEmail('admin6258@labour.com');
                    setLoginPassword('adminpass6258#');
                    setAdminAuthError(null);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeLoginRole === 'admin'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin (Secret Protected)</span>
                </button>
              </div>
            </div>

            {/* SECRET ADMIN AUTH ERROR ALERT */}
            {adminAuthError && (
              <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-600/60 text-rose-300 text-xs font-extrabold flex items-start gap-2.5 shadow-xl animate-bounce">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span>{adminAuthError}</span>
                  <p className="text-[10px] text-rose-200 font-normal">
                    💡 <strong>Secret Rules:</strong> Email prefix before @ must end with <code>6258</code> (e.g. <code>admin6258@labour.com</code>) & Password must end with <code>6258#</code> (e.g. <code>secretpass6258#</code>).
                  </p>
                </div>
              </div>
            )}

            {/* 1-Click Demo Login CTA */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1-Click Demo Access as {activeLoginRole.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400">Instant Access</span>
              </div>

              <button
                type="button"
                onClick={() => handleLoginSubmit(activeLoginRole)}
                className="w-full py-3 rounded-xl gradient-bg hover:opacity-90 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Login Immediately as {activeLoginRole === 'customer' ? 'Customer (Tanvir)' : activeLoginRole === 'broker' ? 'Broker (Mirpur Agency)' : 'Platform Master Admin (6258 / 6258#)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Credential Login Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit(activeLoginRole);
              }}
              className="space-y-4 pt-2 border-t border-slate-800"
            >
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address {activeLoginRole === 'admin' && <span className="text-rose-400 font-normal text-[10px]">(Must end with 6258 before @)</span>}
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 mr-2" />
                  <input
                    type="email"
                    value={loginEmail || (activeLoginRole === 'admin' ? 'admin6258@labour.com' : activeLoginRole === 'broker' ? 'mirpur.broker@labour.com' : 'tanvir@gmail.com')}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                    placeholder={activeLoginRole === 'admin' ? 'e.g. admin6258@labour.com' : 'email@example.com'}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password {activeLoginRole === 'admin' && <span className="text-rose-400 font-normal text-[10px]">(Must end with 6258#)</span>}
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 mr-2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                    placeholder={activeLoginRole === 'admin' ? 'e.g. pass6258#' : 'password'}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Submit Login Credentials
              </button>
            </form>
          </div>
        ) : (

          /* =============================================================== */
          /* MODE 2: IMMEDIATE CREATE ACCOUNT (CUSTOMER & BROKER REGISTRATION) */
          /* =============================================================== */
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Select Account Role to Create
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setRegRole('customer')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    regRole === 'customer'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer (কাস্টমার)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('broker')}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    regRole === 'broker'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Broker Agency (ব্রোকার)</span>
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {regRole === 'broker' ? 'Broker Agency Name (এজেন্সির নাম)' : 'Full Name (আপনার নাম)'}
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                  <User className="w-4 h-4 text-emerald-400 mr-2" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={regRole === 'broker' ? 'e.g., Gulshan Labour Supplier Agency' : 'e.g., Tanvir Ahmed'}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Phone (+880)
                  </label>
                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                    <Phone className="w-4 h-4 text-emerald-400 mr-2" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01700000000"
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                    <Mail className="w-4 h-4 text-emerald-400 mr-2" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full bg-transparent text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Location Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Division</label>
                  <select
                    value={regDivision}
                    onChange={(e) => setRegDivision(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {BANGLADESH_LOCATIONS.map(loc => (
                      <option key={loc.division} value={loc.division}>{loc.division}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">District</label>
                  <select
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {districtsForDivision.map(d => {
                      const distName = typeof d === 'string' ? d : d.name;
                      return <option key={distName} value={distName}>{distName}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Upazila / Area</label>
                  <input
                    type="text"
                    value={regUpazila}
                    onChange={(e) => setRegUpazila(e.target.value)}
                    placeholder="e.g. Mirpur"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Broker-Specific Input: Managed Worker Pool Count */}
              {regRole === 'broker' && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/40 space-y-2">
                  <label className="block text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Initial Managed Worker Pool Count (আপনার লেবার সংখ্যা)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={regWorkerCount}
                    onChange={(e) => setRegWorkerCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Brokers must manage a workforce pool of labourers, electricians & plumbers.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
                  <Lock className="w-4 h-4 text-emerald-400 mr-2" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Registration CTA Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl gradient-bg hover:opacity-90 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Create {regRole === 'broker' ? 'Broker Agency' : 'Customer'} Account & Go to Dashboard Immediately</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
