'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { BANGLADESH_LOCATIONS } from '@/lib/data/bangladesh-locations';
import { SERVICE_CATEGORIES } from '@/lib/data/categories';
import { BrokerCard } from '@/components/cards/BrokerCard';
import { BookingModal } from '@/components/modals/BookingModal';
import { BrokerProfile } from '@/lib/types';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  ShieldCheck, 
  Users, 
  Building2, 
  X,
  Sparkles,
  Zap,
  HardHat,
  Wrench,
  Truck,
  Paintbrush
} from 'lucide-react';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { brokers } = useData();

  // Search State
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [keyword, setKeyword] = useState<string>('');

  // Booking Modal State
  const [selectedBrokerForBooking, setSelectedBrokerForBooking] = useState<BrokerProfile | null>(null);

  // Cascading Districts
  const availableDistricts = useMemo(() => {
    if (selectedDivision === 'All') {
      return BANGLADESH_LOCATIONS.flatMap(d => d.districts);
    }
    const divData = BANGLADESH_LOCATIONS.find(d => d.division === selectedDivision);
    return divData ? divData.districts : [];
  }, [selectedDivision]);

  // Cascading Upazilas
  const availableUpazilas = useMemo(() => {
    if (selectedDistrict === 'All') {
      return availableDistricts.flatMap(d => d.upazilas);
    }
    const distData = availableDistricts.find(d => d.name === selectedDistrict);
    return distData ? distData.upazilas : [];
  }, [selectedDistrict, availableDistricts]);

  // Filter Brokers
  const filteredBrokers = useMemo(() => {
    return brokers.filter(b => {
      if (selectedDivision !== 'All' && b.location.division !== selectedDivision) return false;
      if (selectedDistrict !== 'All' && b.location.district !== selectedDistrict) return false;
      if (selectedUpazila !== 'All' && b.location.upazila !== selectedUpazila) return false;
      if (selectedCategory !== 'All' && !b.servicesOffered.includes(selectedCategory.toLowerCase())) return false;
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchName = b.name.toLowerCase().includes(q) || (b.nameBn && b.nameBn.includes(q));
        const matchLoc = b.location.district.toLowerCase().includes(q) || b.location.upazila.toLowerCase().includes(q);
        const matchSrv = b.servicesOffered.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchLoc && !matchSrv) return false;
      }
      return true;
    });
  }, [brokers, selectedDivision, selectedDistrict, selectedUpazila, selectedCategory, keyword]);

  const clearFilters = () => {
    setSelectedDivision('All');
    setSelectedDistrict('All');
    setSelectedUpazila('All');
    setSelectedCategory('All');
    setKeyword('');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold badge-glow">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'বাংলাদেশ-কেন্দ্রিক ব্রোকার নেটওয়ার্ক' : '100% Bangladesh Verified Brokers & Escrow'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {language === 'bn' ? (
              <>
                খুঁজে নিন আপনার এলাকার <span className="gradient-text">অভিজ্ঞ ব্রোকার ও শ্রমিক</span>
              </>
            ) : (
              <>
                Find Nearby Brokers & Hire <span className="gradient-text">Skilled Workforce</span> Across Bangladesh
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto text-left">
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400">8 Divisions</div>
              <div className="text-xs text-slate-400">64 Districts & Upazilas</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-teal-400">12+ Brokers</div>
              <div className="text-xs text-slate-400">Pre-Verified Regional Hubs</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-amber-400">70+ Workers</div>
              <div className="text-xs text-slate-400">Electricians, Plumbers & Masons</div>
            </div>
            <div className="glass-panel p-3.5 rounded-xl border border-slate-800">
              <div className="text-xl font-extrabold text-emerald-400">৳500 Escrow</div>
              <div className="text-xs text-slate-400">Refundable Advance Deposit</div>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-LOCATION SEARCH & FILTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
                <span>{language === 'bn' ? 'ব্রোকার ফিল্টার ও অনুসন্ধান' : 'Filter Brokers by Location & Skill'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'বিভাগ, জেলা, উপজেলা এবং সেবা অনুযায়ী নিখুঁত অনুসন্ধান' : 'Cascade search across Division, District, Upazila & Category'}
              </p>
            </div>

            {(selectedDivision !== 'All' || selectedDistrict !== 'All' || selectedUpazila !== 'All' || selectedCategory !== 'All' || keyword) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-rose-400 hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{t('clearFilters')}</span>
              </button>
            )}
          </div>

          {/* Search Inputs Row 1: Keyword */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t('searchKeyword')}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Search Inputs Row 2: Location Cascade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Division Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('searchDivision')}</span>
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => {
                  setSelectedDivision(e.target.value);
                  setSelectedDistrict('All');
                  setSelectedUpazila('All');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">{t('allDivisions')}</option>
                {BANGLADESH_LOCATIONS.map((loc) => (
                  <option key={loc.division} value={loc.division}>
                    {loc.division} ({loc.divisionBn})
                  </option>
                ))}
              </select>
            </div>

            {/* District Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('searchDistrict')}</span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedUpazila('All');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">{t('allDistricts')}</option>
                {availableDistricts.map((dist) => (
                  <option key={dist.name} value={dist.name}>
                    {dist.name} ({dist.nameBn})
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('searchUpazila')}</span>
              </label>
              <select
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">{t('allUpazilas')}</option>
                {availableUpazilas.map((up) => (
                  <option key={up.name} value={up.name}>
                    {up.name} ({up.nameBn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Category Pills */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {t('searchCategory')}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Categories
              </button>

              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS LIST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{language === 'bn' ? 'তালিকাভুক্ত ব্রোকারসমূহ' : 'Available Brokers'}</span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              {filteredBrokers.length} {t('resultsFound')}
            </span>
          </h2>
        </div>

        {/* Brokers Grid */}
        {filteredBrokers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrokers.map((broker) => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                onBookClick={(b) => setSelectedBrokerForBooking(b)}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
            <p className="text-slate-400 text-sm">{t('noBrokersFound')}</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </section>

      {/* BOOKING MODAL */}
      {selectedBrokerForBooking && (
        <BookingModal
          broker={selectedBrokerForBooking}
          isOpen={!!selectedBrokerForBooking}
          onClose={() => setSelectedBrokerForBooking(null)}
        />
      )}
    </div>
  );
}
