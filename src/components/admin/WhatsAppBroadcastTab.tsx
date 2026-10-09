import React, { useState } from 'react';
import { 
  MessageCircle, 
  Copy, 
  Check, 
  Share2 
} from 'lucide-react';
import { Post } from '../../types';

interface WhatsAppBroadcastTabProps {
  posts: Post[];
  mainWaUrl: string;
}

export const WhatsAppBroadcastTab: React.FC<WhatsAppBroadcastTabProps> = ({
  posts,
  mainWaUrl
}) => {
  const [selectedPostId, setSelectedPostId] = useState<string>(posts[0]?.id || '');
  const [customHeading, setCustomHeading] = useState('🚨 *NEW SARKARI JOB UPDATE!*');
  const [includeLinks, setIncludeLinks] = useState(true);
  const [copied, setCopied] = useState(false);

  const selectedPost = posts.find(p => p.id === selectedPostId) || posts[0];

  const generateBroadcastText = (): string => {
    if (!selectedPost) return '';
    const lines: string[] = [];
    lines.push(customHeading);
    lines.push(`\n📌 *${selectedPost.title}*`);
    
    if (selectedPost.totalVacancies) {
      lines.push(`👥 कुल पद : *${selectedPost.totalVacancies}*`);
    }
    if (selectedPost.qualification) {
      lines.push(`🎓 योग्यता : *${selectedPost.qualification}*`);
    }
    if (selectedPost.salaryInfo) {
      lines.push(`💰 वेतनमान : *${selectedPost.salaryInfo}*`);
    }
    if (selectedPost.lastDate) {
      lines.push(`⏰ अंतिम तिथि : *${selectedPost.lastDate}*`);
    }
    if (selectedPost.summary) {
      lines.push(`\n📝 *विवरण:*\n${selectedPost.summary}`);
    }
    if (includeLinks && selectedPost.importantLinks && selectedPost.importantLinks.length > 0) {
      lines.push('\n🔗 *महत्वपूर्ण लिंक्स:*');
      selectedPost.importantLinks.forEach(l => {
        lines.push(`👉 ${l.label}: ${l.url}`);
      });
    }
    lines.push(`\n🌐 *पूरी जानकारी देखें:* \n${window.location.origin}/?id=${selectedPost.id}`);
    lines.push(`\n📲 *हमारे WhatsApp चैनल से जुड़ें:*`);
    lines.push(`${mainWaUrl}`);

    return lines.join('\n');
  };

  const formattedText = generateBroadcastText();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(formattedText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <MessageCircle size={20} className="text-emerald-400" />
            <span>WhatsApp Broadcast & Telegram Alert Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            1-click formatted viral text message generator for WhatsApp groups, communities & channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Select Post to Broadcast
            </label>
            <select
              value={selectedPostId}
              onChange={e => setSelectedPostId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
            >
              {posts.map(p => (
                <option key={p.id} value={p.id}>
                  [{p.category}] {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Broadcast Title / Hook (Hindi / English)
            </label>
            <input
              type="text"
              value={customHeading}
              onChange={e => setCustomHeading(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-700">
            <input
              type="checkbox"
              id="include-links"
              checked={includeLinks}
              onChange={e => setIncludeLinks(e.target.checked)}
              className="rounded text-emerald-500"
            />
            <label htmlFor="include-links" className="text-xs font-bold text-slate-200 cursor-pointer">
              Include Direct Official Apply Links in Text
            </label>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={handleCopy}
              className="btn-3d btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="btn-3d btn-wa py-2.5 px-5 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Share2 size={14} />
              <span>Share to WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase">
            WhatsApp Live Message Preview
          </label>
          <div className="p-4 bg-[#0b141a] border border-slate-700 rounded-xl text-slate-200 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed shadow-inner">
            {formattedText}
          </div>
        </div>
      </div>
    </div>
  );
};
