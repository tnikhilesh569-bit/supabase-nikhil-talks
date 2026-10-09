import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, ShieldCheck, Bookmark, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PostCategory } from '../types';
import { getBookmarkedIds } from '../lib/bookmarks';

interface HeaderProps {
  currentView: 'home' | 'post' | 'marketplace' | 'admin';
  onNavigate: (view: 'home' | 'post' | 'marketplace' | 'admin', category?: PostCategory) => void;
  marqueeText: string;
  marqueeEnabled?: boolean;
  emergencyAlert?: string;
  mainWaUrl: string;
  onSelectSavedView?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  marqueeText,
  marqueeEnabled = true,
  emergencyAlert,
  mainWaUrl,
  onSelectSavedView
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getBookmarkedIds().length);
    };
    updateCount();
    window.addEventListener('bookmarks_updated', updateCount);
    return () => window.removeEventListener('bookmarks_updated', updateCount);
  }, []);

  return (
    <>
      {/* High-Priority Emergency Red Alert Banner */}
      {emergencyAlert && emergencyAlert.trim().length > 0 && (
        <div id="emergency-alert-banner" className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 text-white text-xs md:text-sm font-black py-2 px-4 shadow-md flex items-center justify-between border-b border-red-800">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-red-700 shrink-0 animate-bounce">
                <AlertTriangle size={13} className="stroke-[3]" />
              </span>
              <span className="truncate tracking-wide">{emergencyAlert}</span>
            </div>
            <a
              href={mainWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[11px] font-bold bg-white text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Instant Alert</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      )}

      {/* Top Announcement Marquee Bar */}
      {marqueeEnabled && (
        <div id="top-announcement-bar" className="bg-[#0b1329] text-white py-2 px-3 text-xs md:text-sm font-semibold border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-[200px]">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider shrink-0 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Breaking
              </span>
              <div className="overflow-hidden relative w-full whitespace-nowrap text-slate-200 text-xs sm:text-sm">
                <span className="inline-block tracking-wide">{marqueeText}</span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="top-wa-link"
                href={mainWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-wa btn-sm text-xs font-bold py-1 px-3 flex items-center gap-1.5"
              >
                <ExternalLink size={12} />
                <span>Join Official WhatsApp</span>
              </motion.a>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5 md:py-3 flex justify-between items-center">
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => {
              onNavigate('home');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              src="/logo.svg"
              alt="Nikhil Talks Logo"
              className="h-9 md:h-11 w-auto object-contain drop-shadow-sm"
            />
            <div className="hidden sm:block leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase">Govt Job & Result Hub</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Single-click official job notifications</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-home"
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#0056b3] bg-blue-50/80 shadow-xs'
                  : 'text-slate-700 hover:text-[#0056b3] hover:bg-slate-50'
              }`}
            >
              Home
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-jobs"
              onClick={() => onNavigate('home', 'Jobs')}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-[#0056b3] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Jobs
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-notices"
              onClick={() => onNavigate('home', 'Notices')}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-[#0056b3] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Notices
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-scholarships"
              onClick={() => onNavigate('home', 'Scholarships')}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-[#0056b3] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Scholarships
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-yojna"
              onClick={() => onNavigate('home', 'Sarkari Yojna')}
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-[#0056b3] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Sarkari Yojna
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              id="nav-marketplace"
              onClick={() => onNavigate('marketplace')}
              className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                currentView === 'marketplace'
                  ? 'text-[#0056b3] bg-blue-50 font-extrabold shadow-xs'
                  : 'text-slate-700 hover:text-[#0056b3] hover:bg-slate-50'
              }`}
            >
              Marketplace
            </motion.button>

            {/* Saved Bookmarks Button */}
            {onSelectSavedView && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                id="nav-saved-btn"
                onClick={onSelectSavedView}
                className="ml-1 px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all cursor-pointer border border-amber-200/60"
                title="View Saved Updates"
              >
                <Bookmark size={13} className="fill-amber-600 text-amber-600" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white font-extrabold text-[10px]">
                    {savedCount}
                  </span>
                )}
              </motion.button>
            )}

            {/* Admin Panel Button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id="nav-admin"
              onClick={() => onNavigate('admin')}
              className={`ml-1.5 px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white ring-2 ring-slate-400'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Admin Panel</span>
            </motion.button>
          </nav>

          {/* Mobile Menu & Quick Actions Toggle Button */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {onSelectSavedView && (
              <button
                onClick={onSelectSavedView}
                className="p-2 text-amber-700 bg-amber-50 rounded-lg relative"
                title="Saved Posts"
              >
                <Bookmark size={18} className="fill-amber-500" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            )}
            <button
              id="admin-mobile-icon"
              onClick={() => onNavigate('admin')}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              title="Admin Panel"
            >
              <ShieldCheck size={20} className="text-[#0056b3]" />
            </button>
            <button
              id="menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              id="mobile-nav-drawer"
              className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1 shadow-xl overflow-hidden"
            >
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-bold text-slate-800 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('home', 'Jobs');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Latest Jobs
              </button>
              <button
                onClick={() => {
                  onNavigate('home', 'Notices');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Exam Notices & Results
              </button>
              <button
                onClick={() => {
                  onNavigate('home', 'Scholarships');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Scholarships
              </button>
              <button
                onClick={() => {
                  onNavigate('home', 'Sarkari Yojna');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Sarkari Yojna
              </button>
              <button
                onClick={() => {
                  onNavigate('marketplace');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-bold text-slate-800 hover:bg-blue-50 hover:text-[#0056b3] rounded-lg"
              >
                Student Marketplace
              </button>
              {onSelectSavedView && (
                <button
                  onClick={() => {
                    onSelectSavedView();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Bookmark size={15} className="fill-amber-600" />
                    Saved Bookmarks
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-bold">
                    {savedCount}
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2 mt-2"
              >
                <ShieldCheck size={16} className="text-emerald-500" />
                Admin Dashboard (Nikhilbabu Access)
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Animated Gradient Separator Line */}
      <div className="animated-gradient-line" />
    </>
  );
};
