import React, { useState } from 'react';
import { DollarSign, Save, Check, ExternalLink, Zap, Shield, Sparkles } from 'lucide-react';
import { NoticeSettings } from '../../types';

interface MonetagTabProps {
  settings: NoticeSettings;
  onSaveSettings: (settings: Partial<NoticeSettings>) => Promise<void>;
}

export const MonetagTab: React.FC<MonetagTabProps> = ({
  settings,
  onSaveSettings
}) => {
  const [monetagEnabled, setMonetagEnabled] = useState(settings.monetagEnabled ?? true);
  const [monetagZoneCode, setMonetagZoneCode] = useState(settings.monetagZoneCode || '11853011');
  const [monetagInPagePush, setMonetagInPagePush] = useState(settings.monetagInPagePush ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings({
        monetagEnabled,
        monetagZoneCode: monetagZoneCode.trim(),
        monetagInPagePush
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save Monetag monetization settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <DollarSign size={20} className="text-emerald-400" />
            <span>Monetag Monetization Control Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Monetag native banners, In-Page Push notifications, and multi-tag zones.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Monetag Connected
        </span>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>Monetag monetization settings updated successfully!</span>
        </div>
      )}

      {/* Monetag Service Worker & Zone Status Card */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Zap size={15} />
            <span>Active Monetag Service Worker (/sw.js)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            domain: 5gvci.com
          </span>
        </div>
        <p className="text-xs text-slate-300">
          The service worker file <code className="text-sky-300">/sw.js</code> is active with Zone ID <code className="text-emerald-300 font-mono font-bold">11853011</code>. In-Page Push and Vignette notifications trigger safely without obstructing public content.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Master Monetag Switch */}
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Enable Monetag Ads</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-900/40 text-blue-300 font-bold">Master</span>
            </div>
            <div className="text-xs text-slate-400">Master toggle for public banner slots and ad scripts across portal</div>
          </div>
          <input
            type="checkbox"
            checked={monetagEnabled}
            onChange={e => setMonetagEnabled(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-600 cursor-pointer"
          />
        </div>

        {/* Individual Monetag Formats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>In-Page Push (IPP)</span>
              </span>
              <input
                type="checkbox"
                checked={monetagInPagePush}
                onChange={e => setMonetagInPagePush(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              High-CTR slide-in interactive notifications tailored for government job and result alerts.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-200 uppercase flex items-center gap-1.5">
                <Shield size={14} className="text-sky-400" />
                <span>Zone Protection</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Clean Script</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Safe injection via React lifecycle hooks to prevent memory leaks and duplicate script calls.
            </p>
          </div>
        </div>

        {/* Monetag Zone Code / Zone ID Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Monetag Zone Code / Zone ID *
          </label>
          <input
            type="text"
            required
            value={monetagZoneCode}
            onChange={e => setMonetagZoneCode(e.target.value)}
            placeholder="e.g. 11853011"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-emerald-400 focus:border-[#38bdf8] outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Linked to your Monetag Publisher dashboard (Zone ID: <strong className="text-slate-300 font-mono">11853011</strong> for domain <strong className="text-slate-300 font-mono">5gvci.com</strong>).
          </p>
        </div>

        {/* Official Publisher Link */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Need to create more ad zones or view earnings?</span>
          <a
            href="https://monetag.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
          >
            <span>Monetag Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-3d btn-primary py-2.5 px-6 text-xs font-bold bg-emerald-600 cursor-pointer"
        >
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : 'Save Monetag Settings'}</span>
        </button>
      </form>
    </div>
  );
};
