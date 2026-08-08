'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { AIEstimatorModal } from '@/components/ai/AIEstimatorModal';
import { 
  Briefcase, 
  Globe, 
  UserCheck, 
  ShieldAlert, 
  User, 
  Search, 
  LayoutDashboard,
  LogOut,
  LogIn,
  Home,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage, t } = useLanguage();
  const { role, user, logout } = useAuth();
  const [isEstimatorOpen, setIsEstimatorOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Labour<span className="text-emerald-400">.com</span>
              </span>
              <span className="text-xs text-slate-400 block -mt-1 font-medium">
                {language === 'bn' ? 'বাংলাদেশ লেবার মার্কেটপ্লেস' : 'Bangladesh Labour Network'}
              </span>
            </div>
          </Link>

          {/* Navigation Links with Universal HOME Button */}
          <nav className="flex items-center space-x-3">
            
            {/* Universal HOME Link for All Users */}
            <Link
              href="/"
              className={`text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                pathname === '/' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>

            {/* AI Price Estimator Trigger (Customers & Guests Only) */}
            {role !== 'broker' && (
              <button
                onClick={() => setIsEstimatorOpen(true)}
                className="text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-teal-500/40 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{language === 'bn' ? 'এআই প্রাইস ক্যালকুলেটর' : 'AI Price Estimator'}</span>
              </button>
            )}

            {/* Customer Navigation */}
            {role === 'customer' && (
              <>
                <Link
                  href="/"
                  className={`hidden sm:flex text-xs font-bold items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    pathname === '/' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  <span>{t('navSearch')}</span>
                </Link>

                <Link
                  href="/dashboard/customer"
                  className={`text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    pathname === '/dashboard/customer' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Customer Dashboard</span>
                </Link>
              </>
            )}

            {/* Broker Navigation */}
            {role === 'broker' && (
              <Link
                href="/dashboard/broker"
                className={`text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  pathname === '/dashboard/broker' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Broker Agency Portal</span>
              </Link>
            )}

            {/* Admin Navigation */}
            {role === 'admin' && (
              <Link
                href="/dashboard/admin"
                className={`text-xs font-bold flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  pathname === '/dashboard/admin' ? 'text-rose-400 bg-rose-950/60 border border-rose-800/40' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Admin Control Center</span>
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Logged-In User Role Badge */}
            {user && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400">Role:</span>
                <span className="text-emerald-400 uppercase tracking-wider font-extrabold">
                  {role === 'customer' ? 'Customer' : role === 'broker' ? 'Broker' : 'Admin'}
                </span>
              </div>
            )}

            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-extrabold hover:bg-emerald-900/80 transition-all"
              title="Toggle Bangla / English"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Logout / Login CTA */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-300 text-xs font-bold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('navLogout')}</span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl gradient-bg text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <AIEstimatorModal isOpen={isEstimatorOpen} onClose={() => setIsEstimatorOpen(false)} />
    </header>
  );
};
