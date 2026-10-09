import React from 'react';
import { PostCategory } from '../types';

interface FooterProps {
  aboutText: string;
  onNavigate: (view: 'home' | 'post' | 'marketplace' | 'admin', category?: PostCategory) => void;
  mainWaUrl: string;
  ch1?: string;
  ch2?: string;
  ch3?: string;
  ch4?: string;
}

export const Footer: React.FC<FooterProps> = ({
  aboutText,
  onNavigate,
  mainWaUrl,
  ch1,
  ch2,
  ch3,
  ch4
}) => {
  return (
    <footer className="bg-[#12121e] text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* About Section */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="Nikhil Talks Logo"
                className="h-9 w-auto brightness-200 contrast-125"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {aboutText || "Nikhil Talks is your trusted student & career portal providing official job notices, entrance updates, sarkari yojna details, and utility marketplace services."}
            </p>
            <div className="pt-2">
              <a
                href={mainWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d btn-wa btn-sm text-xs font-bold"
              >
                Follow WhatsApp Channel
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home', 'Jobs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Latest Govt Jobs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home', 'Notices')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Exam Notices & Results
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home', 'Scholarships')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Scholarships Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('home', 'Sarkari Yojna')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sarkari Yojna
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Student Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* WhatsApp Channels */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Official WhatsApp Channels
            </h4>
            <ul className="space-y-2 text-xs">
              {ch1 && (
                <li>
                  <a href={ch1} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Jobs Alerts Group</span>
                  </a>
                </li>
              )}
              {ch2 && (
                <li>
                  <a href={ch2} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Notices & Results Group</span>
                  </a>
                </li>
              )}
              {ch3 && (
                <li>
                  <a href={ch3} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Scholarships Group</span>
                  </a>
                </li>
              )}
              {ch4 && (
                <li>
                  <a href={ch4} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Sarkari Yojna Group</span>
                  </a>
                </li>
              )}
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[11px] text-slate-500 hover:text-slate-300 font-semibold cursor-pointer"
                >
                  Admin Login Panel
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© 2026 Nikhil Talks. All Rights Reserved. Empowering aspirants across India.</p>
        </div>
      </div>
    </footer>
  );
};
