'use client';

import React from 'react';
import { Worker } from '@/lib/types';
import { useLanguage } from '@/lib/context/LanguageContext';
import { UserCheck, Star, Clock, Award } from 'lucide-react';

interface WorkerCardProps {
  worker: Worker;
  onSelectWorker?: (worker: Worker) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onSelectWorker }) => {
  const { t } = useLanguage();

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-sm">
            {worker.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{worker.name}</span>
              {worker.rating && (
                <span className="text-amber-400 text-xs font-semibold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" /> {worker.rating}
                </span>
              )}
            </h4>
            <p className="text-xs text-emerald-400 font-medium">{worker.category}</p>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            worker.available
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
              : 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
          }`}
        >
          {worker.available ? t('statusAvailable') : t('statusBusy')}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          <span>{worker.experienceYears} {t('expYears')}</span>
        </div>
        <div className="flex items-center gap-1 text-right justify-end font-semibold text-emerald-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>৳{worker.dailyRate} / day</span>
        </div>
      </div>

      {onSelectWorker && (
        <button
          onClick={() => onSelectWorker(worker)}
          className="mt-3 w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Select Worker</span>
        </button>
      )}
    </div>
  );
};
