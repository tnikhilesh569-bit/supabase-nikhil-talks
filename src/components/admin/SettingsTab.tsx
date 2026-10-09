import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RefreshCw, 
  Save, 
  ShieldCheck, 
  Trash2, 
  Check, 
  Search 
} from 'lucide-react';
import { Post, MarketplaceItem, NoticeSettings, AdminAuditLog } from '../../types';
import { importAllDataJson, resetAllDataToDefault, clearAuditLogs } from '../../lib/supabase';

interface SettingsTabProps {
  posts: Post[];
  marketplace: MarketplaceItem[];
  settings: NoticeSettings;
  auditLogs: AdminAuditLog[];
  onSaveSettings: (settings: Partial<NoticeSettings>) => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  posts,
  marketplace,
  settings,
  auditLogs,
  onSaveSettings
}) => {
  const [aboutText, setAboutText] = useState(settings.aboutText || '');
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail || 'support@nikhiltalks.com');
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone || '+91 98765 43210');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      portal: 'Nikhil Talks',
      posts,
      marketplace,
      settings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nikhil_talks_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const success = importAllDataJson(json);
        if (success) {
          alert('Data restored successfully! Refreshing view...');
          window.location.reload();
        } else {
          alert('Invalid backup format.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to default
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all posts, marketplace ads and settings to verified default demo data?')) {
      resetAllDataToDefault();
      alert('Reset complete! Reloading...');
      window.location.reload();
    }
  };

  // Clear audit logs
  const handleClearLogs = () => {
    if (confirm('Clear audit history logs?')) {
      clearAuditLogs();
      window.location.reload();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings({
        aboutText,
        supportEmail,
        supportPhone
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = auditLogs.filter(l => 
    l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(auditSearch.toLowerCase())) ||
    l.user.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Backup & Data Hub */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Download size={20} className="text-[#38bdf8]" />
            <span>Database Backup, Restore & Data Portability</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Download complete snapshots of all jobs, exam notices, marketplace ads, and configuration.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-3">
          <p className="text-xs text-slate-300">
            Export a comprehensive JSON backup or restore from a previously downloaded file at any time.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleExportBackup}
              className="btn-3d btn-primary btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={14} />
              <span>Download Full Backup (JSON)</span>
            </button>
            <label className="btn-3d btn-secondary btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-slate-700 hover:bg-slate-600 text-white">
              <Upload size={14} />
              <span>Restore from JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleResetData}
              className="btn-3d btn-danger btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer ml-auto"
            >
              <RefreshCw size={13} />
              <span>Reset Default Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portal Contact & About Settings */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Settings size={20} className="text-blue-400" />
            <span>Portal Contact & Support Information</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Set support contact details and about overview displayed in the footer.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Check size={16} />
            <span>Portal settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Support Email Address
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                WhatsApp Support / Helpline
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={e => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              About Us / Portal Overview
            </label>
            <textarea
              rows={3}
              value={aboutText}
              onChange={e => setAboutText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-3d btn-primary py-2.5 px-6 text-xs font-bold cursor-pointer"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving...' : 'Save Portal Info'}</span>
          </button>
        </form>
      </div>

      {/* Full Audit Log Viewer */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Full Admin Activity Audit Logs ({auditLogs.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Immutable session activity tracker recording logins, updates, and publishing events.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                className="pl-7 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none w-36"
              />
            </div>
            <button
              onClick={handleClearLogs}
              title="Clear Logs"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700/80 max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-700 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 bg-slate-900/40">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const dateStr = new Date(log.timestamp).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });
                  return (
                    <tr key={log.id} className="hover:bg-slate-700/20">
                      <td className="py-2.5 px-3 font-bold text-sky-300 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-2.5 px-3 text-white font-medium max-w-xs truncate">
                        {log.target}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-semibold truncate max-w-[120px]">
                        {log.user}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">
                        {log.details || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
