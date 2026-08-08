'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useData } from '@/lib/context/DataContext';
import { BANGLADESH_LOCATIONS } from '@/lib/data/bangladesh-locations';
import { 
  Briefcase, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ArrowRight,
  Building2,
  Users,
  Sparkles
} from 'lucide-react';

export default function RegisterPage() {
  const { language } = useLanguage();
  const { login } = useAuth();
  const { addBrokerAgency } = useData();
  const router = useRouter();

  const [regRole, setRegRole] = useState<'customer' | 'broker'>('customer');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('01700123456');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('password123');
  const [regDivision, setRegDivision] = useState('Dhaka');
  const [regDistrict, setRegDistrict] = useState('Dhaka');
  const [regUpazila, setRegUpazila] = useState('Mirpur');
  const [regWorkerCount, setRegWorkerCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    const email = regEmail || `${regRole}_${Date.now()}@labour.com`;

    if (regRole === 'broker') {
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

    login(email, regRole, regName, regPhone, { division: regDivision, district: regDistrict, upazila: regUpazila });
    router.push(`/dashboard/${regRole}`);
  };

  const districtsForDivision = BANGLADESH_LOCATIONS.find(l => l.division === regDivision)?.districts || ['Dhaka'];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-950">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create {regRole === 'broker' ? 'Broker Agency' : 'Customer'} Account
          </h1>
          <p className="text-xs text-slate-400">
            {language === 'bn' ? 'লেবার.কম সাইন আপ পোর্টাল' : 'Join Bangladesh’s broker-mediated labour marketplace'}
          </p>
        </div>

        {/* Account Role Selector */}
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
            <UserIcon className="w-4 h-4" />
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              {regRole === 'broker' ? 'Broker Agency Name' : 'Full Name'}
            </label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5">
              <UserIcon className="w-4 h-4 text-emerald-400 mr-2" />
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder={regRole === 'broker' ? 'e.g. Gulshan Labour Supplier Agency' : 'e.g. Tanvir Ahmed'}
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
                <span>Initial Managed Worker Pool Count</span>
              </label>
              <input
                type="number"
                min={1}
                value={regWorkerCount}
                onChange={(e) => setRegWorkerCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
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

          <button
            type="submit"
            className="w-full py-4 rounded-2xl gradient-bg hover:opacity-90 text-white font-extrabold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create {regRole === 'broker' ? 'Broker Agency' : 'Customer'} Account & Go to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
