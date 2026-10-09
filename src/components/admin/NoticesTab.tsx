import React, { useState } from 'react';
import { Bell, AlertTriangle, Save, Check } from 'lucide-react';
import { NoticeSettings } from '../../types';

interface NoticesTabProps {
  settings: NoticeSettings;
  onSaveSettings: (settings: Partial<NoticeSettings>) => Promise<void>;
}

export const NoticesTab: React.FC<NoticesTabProps> = ({
  settings,
  onSaveSettings
}) => {
  const [noticeText, setNoticeText] = useState(settings.marqueeText || '');
  const [marqueeEnabled, setMarqueeEnabled] = useState(settings.marqueeEnabled ?? true);
  const [emergencyAlert, setEmergencyAlert] = useState(settings.emergencyAlert || '');
  const [mainWaUrl, setMainWaUrl] = useState(settings.mainWaUrl || '');
  const [ch1, setCh1] = useState(settings.ch1 || '');
  const [ch2, setCh2] = useState(settings.ch2 || '');
  const [ch3, setCh3] = useState(settings.ch3 || '');
  const [ch4, setCh4] = useState(settings.ch4 || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings({
        marqueeText: noticeText,
        marqueeEnabled,
        emergencyAlert,
        mainWaUrl,
        ch1,
        ch2,
        ch3,
        ch4
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to update alert settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Bell size={20} className="text-amber-400" />
          <span>Alerts, Marquee Bar & WhatsApp Channel Routing</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Broadcast real-time high-priority alerts across the entire site and manage official WhatsApp channel community links.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>Notices & WhatsApp links saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* High-Priority Emergency Red Banner */}
        <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-xl space-y-2">
          <label className="block text-xs font-black text-red-300 uppercase flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-red-400" />
            <span>High-Priority Emergency Alert Banner (Shown at absolute top)</span>
          </label>
          <input
            type="text"
            value={emergencyAlert}
            onChange={e => setEmergencyAlert(e.target.value)}
            placeholder="e.g. 🚨 ALERT: BSSC Exam Date Extended! Check revised schedule now."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-red-700/60 rounded-lg text-xs text-white focus:border-red-400 outline-none"
          />
          <p className="text-[11px] text-red-300/80">
            Leave blank to hide. When filled, displays a prominent pulsing red alert bar above the header.
          </p>
        </div>

        {/* Top Marquee Announcement */}
        <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase">
              Top Running Marquee Text
            </label>
            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={marqueeEnabled}
                onChange={e => setMarqueeEnabled(e.target.checked)}
                className="rounded text-blue-500"
              />
              <span>Show Bar</span>
            </label>
          </div>
          <textarea
            rows={2}
            required
            value={noticeText}
            onChange={e => setNoticeText(e.target.value)}
            placeholder="Continuous scrolling notice message..."
            className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-[#38bdf8] outline-none"
          />
        </div>

        {/* Main WhatsApp Channel Link */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
            Primary WhatsApp Channel Link *
          </label>
          <input
            type="url"
            required
            value={mainWaUrl}
            onChange={e => setMainWaUrl(e.target.value)}
            placeholder="https://whatsapp.com/channel/..."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-[#38bdf8] outline-none"
          />
          <p className="text-[11px] text-slate-400 mt-1">Used for floating WhatsApp button, header link, and post detail CTAs.</p>
        </div>

        {/* Vertical Specific Channels */}
        <div className="pt-3 border-t border-slate-700 space-y-3">
          <h4 className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
            Dedicated Vertical WhatsApp Channels (Footer & Category Links)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Jobs Group URL</label>
              <input
                type="url"
                value={ch1}
                onChange={e => setCh1(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Notices & Results Group URL</label>
              <input
                type="url"
                value={ch2}
                onChange={e => setCh2(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Scholarships Group URL</label>
              <input
                type="url"
                value={ch3}
                onChange={e => setCh3(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Sarkari Yojna Group URL</label>
              <input
                type="url"
                value={ch4}
                onChange={e => setCh4(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="btn-3d btn-primary py-2.5 px-6 text-xs font-bold cursor-pointer"
        >
          <Save size={14} />
          <span>{isSaving ? 'Saving...' : 'Save Notices & Channels'}</span>
        </button>
      </form>
    </div>
  );
};
