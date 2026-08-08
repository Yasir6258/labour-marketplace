'use client';

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { useAuth } from '@/lib/context/AuthContext';
import { WorkerCard } from '@/components/cards/WorkerCard';
import { BookingModal } from '@/components/modals/BookingModal';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  ShieldCheck, 
  Users, 
  Calendar, 
  Briefcase, 
  Plus, 
  CheckCircle2
} from 'lucide-react';

export default function BrokerProfileClient({ id }: { id: string }) {
  const { t, language } = useLanguage();
  const { brokers, reviews, addWorker } = useData();
  const { role } = useAuth();

  const broker = brokers.find(b => b.id === id);

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState<boolean>(false);

  // Add Worker Form State
  const [workerName, setWorkerName] = useState<string>('');
  const [workerCategory, setWorkerCategory] = useState<string>(
    broker?.servicesOffered[0] || 'Electrician'
  );
  const [workerDailyRate, setWorkerDailyRate] = useState<number>(950);
  const [workerExp, setWorkerExp] = useState<number>(4);

  if (!broker) return notFound();

  const brokerReviews = reviews.filter(r => r.brokerId === broker.id);

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) return;

    addWorker(broker.id, {
      name: workerName,
      category: workerCategory,
      dailyRate: workerDailyRate,
      hourlyRate: Math.round(workerDailyRate / 7),
      experienceYears: workerExp,
      available: true,
      rating: 4.8
    });

    setWorkerName('');
    setIsAddWorkerOpen(false);
  };

  const getServiceBadge = (cat: string) => {
    const map: Record<string, string> = {
      labourer: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      electrician: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      plumber: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      mason: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      carpenter: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      painter: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      driver: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      welder: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };
    return map[cat.toLowerCase()] || 'bg-white/10 text-slate-300 border-white/10';
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Broker Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-cyan-900/30">
                {broker.name.charAt(0)}
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {language === 'bn' && broker.nameBn ? broker.nameBn : broker.name}
                  </h1>
                  {broker.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'যাচাইকৃত এজেন্সি' : 'Verified Agency'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {broker.location.upazila}, {broker.location.district}, {broker.location.division}
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {broker.ratingAvg.toFixed(1)} ({broker.reviewCount} {language === 'bn' ? 'রিভিউ' : 'reviews'})
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {broker.totalJobsCompleted} {language === 'bn' ? 'টি কাজ সম্পন্ন' : 'Jobs Done'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="flex-1 md:flex-none px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer"
              >
                {language === 'bn' ? 'শ্রমিক বুক করুন' : 'Book Workers'}
              </button>

              {role === 'broker' && (
                <button
                  onClick={() => setIsAddWorkerOpen(true)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  {language === 'bn' ? 'নতুন শ্রমিক যোগ' : 'Add Worker'}
                </button>
              )}
            </div>
          </div>

          {/* Bio & Details Grid */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" /> {language === 'bn' ? 'শ্রমিক বহর' : 'Roster Count'}
              </div>
              <p className="text-lg font-bold text-white">{broker.workers?.length || broker.workerCount} {language === 'bn' ? 'জন সক্রিয়' : 'Active'}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" /> {language === 'bn' ? 'যুক্ত হওয়ার তারিখ' : 'Member Since'}
              </div>
              <p className="text-lg font-bold text-white">{broker.joinedDate}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" /> {language === 'bn' ? 'হটলাইন' : 'Helpline'}
              </div>
              <p className="text-sm font-semibold text-slate-200">{broker.phone}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
              <div className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-purple-400" /> {language === 'bn' ? 'ইমেইল' : 'Email'}
              </div>
              <p className="text-sm font-semibold text-slate-200 truncate">{broker.email}</p>
            </div>
          </div>

          {/* Services tags */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> {language === 'bn' ? 'উপলব্ধ সেবা:' : 'Services:'}
            </span>
            {broker.servicesOffered.map((srv, idx) => (
              <span 
                key={idx} 
                className={`px-3 py-1 rounded-lg text-xs font-medium border uppercase tracking-wider ${getServiceBadge(srv)}`}
              >
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Worker Inventory Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {language === 'bn' ? 'উপলব্ধ দক্ষ শ্রমিকদের তালিকা' : 'Available Skilled Workers'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'bn' 
                  ? 'এই এজেন্সির অধীনস্থ পরীক্ষিত ও নির্ভরযোগ্য কারিগরবৃন্দ' 
                  : 'Verified and background checked workers under this broker'}
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {broker.workers?.length || 0} {language === 'bn' ? 'জন কর্মী' : 'Workers'}
            </span>
          </div>

          {broker.workers && broker.workers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {broker.workers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onSelectWorker={() => setIsBookingOpen(true)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <p>{language === 'bn' ? 'কোনো শ্রমিক পাওয়া যায়নি।' : 'No workers listed yet.'}</p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'bn' ? 'গ্রাহকদের রেটিং ও মন্তব্য' : 'Customer Reviews & Feedback'}
          </h2>
          {brokerReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brokerReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rev.customerName}</span>
                    <span className="flex items-center text-amber-400 text-xs font-bold gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {rev.rating}.0
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic">"{rev.comment}"</p>
                  <p className="text-[11px] text-slate-500">{rev.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/20 border border-slate-800/50 text-slate-500 text-sm">
              {language === 'bn' ? 'এখনো কোনো রিভিউ জমা পড়েনি।' : 'No customer reviews yet.'}
            </div>
          )}
        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        broker={broker}
      />

      {/* Add Worker Modal for Broker */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">
              {language === 'bn' ? 'নতুন দক্ষ কর্মী যুক্ত করুন' : 'Add New Worker to Roster'}
            </h3>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'bn' ? 'শ্রমিকের নাম' : 'Worker Name'}</label>
                <input
                  type="text"
                  required
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  placeholder="e.g. মো: রফিকুল ইসলাম"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">{language === 'bn' ? 'ক্যাটাগরি / পেশা' : 'Category / Trade'}</label>
                <select
                  value={workerCategory}
                  onChange={(e) => setWorkerCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Electrician">Electrician (ইলেকট্রিশিয়ান)</option>
                  <option value="Plumber">Plumber (প্লাম্বার)</option>
                  <option value="Mason">Mason (রাজমিস্ত্রি)</option>
                  <option value="Labourer">General Labourer (সাধারণ শ্রমিক)</option>
                  <option value="Carpenter">Carpenter (কাঠমিস্ত্রি)</option>
                  <option value="Painter">Painter (রংমিস্ত্রি)</option>
                  <option value="Welder">Welder (ওয়েল্ডার)</option>
                  <option value="Driver">Driver (ড্রাইভার)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{language === 'bn' ? 'দৈনিক রেট (৳)' : 'Daily Rate (৳)'}</label>
                  <input
                    type="number"
                    value={workerDailyRate}
                    onChange={(e) => setWorkerDailyRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{language === 'bn' ? 'অভিজ্ঞতা (বছর)' : 'Experience (Yrs)'}</label>
                  <input
                    type="number"
                    value={workerExp}
                    onChange={(e) => setWorkerExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
