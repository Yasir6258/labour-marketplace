'use client';

import React from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Briefcase, ShieldCheck, MapPin, PhoneCall, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">Labour.com</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'বাংলাদেশের ৬৪টি জেলা ও ৫০০টি উপজেলায় বিশ্বস্ত ব্রোকার ও অভিজ্ঞ শ্রমিক সংস্থানকারী মার্কেটপ্লেস।'
                : 'Bangladesh’s leading broker-mediated workforce platform. Secure escrow payments & verified local labor.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 p-2 rounded border border-emerald-900/60">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? '১০০% নিরাপদ এসক্রো গ্যারান্টি (৳)' : '100% Secure Escrow Payout (৳)'}</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              {language === 'bn' ? 'প্রধান বিভাগসমূহ' : 'Divisions Covered'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Dhaka Division (ঢাকা বিভাগ)</li>
              <li>Chittagong Division (চট্টগ্রাম বিভাগ)</li>
              <li>Sylhet Division (সিলেট বিভাগ)</li>
              <li>Khulna Division (খুলনা বিভাগ)</li>
              <li>Rajshahi Division (রাজশাহী বিভাগ)</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">
              {language === 'bn' ? 'জনপ্রিয় সেবাসমূহ' : 'Popular Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Electrician (ইলেকট্রিশিয়ান)</li>
              <li>Plumber (প্লাম্বার / স্যানিটারি)</li>
              <li>General Labourer (সাধারণ শ্রমিক)</li>
              <li>Mason / Raj Mistri (রাজমিস্ত্রি)</li>
              <li>Cleaner (পরিচ্ছন্নতাকর্মী)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm mb-1">
              {language === 'bn' ? 'জরুরি সহায়তা' : 'Support Hotline'}
            </h4>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <PhoneCall className="w-5 h-5" />
              <span>+880 9612-LABOUR</span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'bn' ? '২৪/৭ গ্রাহক সহায়তা ও ব্রোকার হেল্পডেস্ক' : '24/7 Helpline for Customers & Brokers'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SSLCommerz & Mobile Financial Services</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Labour.com. All rights reserved across Bangladesh.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-500" /> Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
