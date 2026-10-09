import React from 'react';
import { Search, Sparkles, X, TrendingUp, CheckCircle2, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTagClick: (tag: string) => void;
  totalPostsCount?: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  onTagClick,
  totalPostsCount = 12
}) => {
  const popularTags = [
    "BSSC Inter Level",
    "SSC CGL 2026",
    "NSP Scholarship",
    "PM Kisan Yojna",
    "Admit Card",
    "10+2 Jobs",
    "Graduate Jobs"
  ];

  return (
    <section id="hero-section" className="bg-gradient-to-b from-blue-50/70 via-slate-50/40 to-white py-10 md:py-14 px-4 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto text-center">
        {/* Pulsing Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 text-[#0056b3] text-xs font-black mb-4 border border-blue-200/80 shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <Sparkles size={13} />
          <span>India's Fast & Verified Govt Job Alert Portal</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-tight"
        >
          Latest Government Jobs, Results, <br className="hidden sm:inline" />
          <span className="text-[#0056b3]">Admit Cards & Sarkari Yojna</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-7 font-medium leading-relaxed"
        >
          Instant, verified notification details, direct official apply links, syllabus PDFs, and student utility marketplace.
        </motion.p>

        {/* Search Bar with glowing focus & motion */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="relative max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2.5"
        >
          <div className="relative w-full shadow-sm rounded-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by exam name, department, scholarship (e.g. BSSC, SSC, NSP)..."
              className="w-full pl-10 pr-9 py-3.5 bg-white border-2 border-slate-300 focus:border-[#0056b3] focus:ring-4 focus:ring-blue-100 rounded-xl text-slate-900 text-sm md:text-base font-semibold outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="search-btn"
            className="btn-3d btn-primary w-full sm:w-auto py-3.5 px-6 text-sm font-bold shrink-0 flex items-center justify-center gap-2"
          >
            <Search size={16} />
            <span>Search</span>
          </motion.button>
        </motion.div>

        {/* Trending Tags */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <TrendingUp size={13} className="text-[#0056b3]" />
            Trending:
          </span>
          {popularTags.map((tag) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={tag}
              onClick={() => onTagClick(tag)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#0056b3] text-slate-700 font-semibold rounded-md border border-slate-200 transition-all cursor-pointer shadow-2xs hover:border-blue-300"
            >
              {tag}
            </motion.button>
          ))}
        </div>

        {/* Quick Trust Highlights Banner */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
              ⚡
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">{totalPostsCount}+ Updates</div>
              <div className="text-[10px] text-slate-500">Live on portal</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">100% Official</div>
              <div className="text-[10px] text-slate-500">Direct PDF links</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-xs">
              <Users size={16} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">45K+ Aspirants</div>
              <div className="text-[10px] text-slate-500">WhatsApp members</div>
            </div>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-xs">
              <Award size={16} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Monetag Safe</div>
              <div className="text-[10px] text-slate-500">Fast verified alerts</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
