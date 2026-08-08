'use client';

import React from 'react';
import Link from 'next/link';
import { BrokerProfile } from '@/lib/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useData } from '@/lib/context/DataContext';
import { 
  MapPin, 
  Star, 
  Users, 
  ShieldCheck, 
  Heart, 
  ArrowRight,
  Phone
} from 'lucide-react';

interface BrokerCardProps {
  broker: BrokerProfile;
  onBookClick: (broker: BrokerProfile) => void;
}

export const BrokerCard: React.FC<BrokerCardProps> = ({ broker, onBookClick }) => {
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useData();
  const favorited = isFavorite(broker.id);

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative group border border-slate-800">
      
      {/* Top Bar: Verification Badge & Favorite Heart */}
      <div className="flex items-center justify-between mb-4">
        {broker.verified ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-semibold border border-emerald-600/50 badge-glow">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('verifiedBroker')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-[11px] font-medium border border-amber-600/40">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{language === 'bn' ? `আনভেরিফাইড (${broker.totalJobsCompleted || 0}/৫ কাজ)` : `Unverified (${broker.totalJobsCompleted || 0}/5 Jobs)`}</span>
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(broker.id);
          }}
          className={`p-2 rounded-full transition-colors ${
            favorited
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-slate-800/80 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
          }`}
          title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* BROKER NAME HIGHLIGHTED PROMINENTLY */}
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-emerald-400 transition-colors tracking-tight leading-snug">
            {language === 'bn' && broker.nameBn ? broker.nameBn : broker.name}
          </h3>
          {/* LOCATION SHOWN DIRECTLY BELOW NAME IN SMALLER FONT */}
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>
              {broker.location.division} ({broker.location.district} - {broker.location.upazila})
            </span>
          </p>
        </div>

        {/* Ratings & Workers Managed Badges */}
        <div className="flex items-center gap-3 py-2 border-y border-slate-800/80">
          <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{broker.ratingAvg}</span>
            <span className="text-xs text-slate-400 font-normal">({broker.reviewCount})</span>
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-900/40">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{broker.workerCount} {t('workersAvailable')}</span>
          </div>
        </div>

        {/* Primary Services Pills */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {t('primaryServices')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {broker.servicesOffered.map((srv, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 text-xs font-medium border border-slate-700/80 capitalize"
              >
                {srv}
              </span>
            ))}
          </div>
        </div>

        {/* Protected Phone Badge (Hidden from Customer Interface to Prevent Bypass) */}
        <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'bn' 
              ? 'নম্বর সুরক্ষিত (বুকিংয়ের পর ব্রোকার আপনাকে কল দিবে)' 
              : 'Phone Protected (Broker calls after booking confirmation)'}
          </span>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
        <Link
          href={`/brokers/${broker.id}`}
          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
        >
          <span>{t('viewProfile')}</span>
        </Link>

        <button
          onClick={() => onBookClick(broker)}
          className="flex-1 py-2.5 px-3 rounded-xl gradient-bg hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-1 group/btn"
        >
          <span>{t('bookBrokerNow')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
