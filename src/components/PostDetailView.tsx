import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Bookmark, 
  Printer, 
  Copy, 
  Check, 
  GraduationCap, 
  Users, 
  IndianRupee 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Post } from '../types';
import { isPostBookmarked, togglePostBookmark } from '../lib/bookmarks';
import { MonetagSlot } from './MonetagSlot';

interface PostDetailViewProps {
  post: Post;
  relatedPosts: Post[];
  onBack: () => void;
  onSelectPost: (id: string) => void;
  mainWaUrl: string;
  monetagEnabled?: boolean;
  monetagZoneCode?: string;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  relatedPosts,
  onBack,
  onSelectPost,
  mainWaUrl,
  monetagEnabled = true,
  monetagZoneCode
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setIsSaved(isPostBookmarked(post.id));
  }, [post.id]);

  let formattedDate = 'Recently';
  try {
    if (post.createdAt) {
      formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  } catch {}

  const handleToggleBookmark = () => {
    const saved = togglePostBookmark(post.id);
    setIsSaved(saved);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this update on Nikhil Talks:\n*${post.title}*\n\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const getLinkStatusBadge = (status: 'active' | 'expired' | 'soon') => {
    if (status === 'expired') {
      return (
        <span className="btn-3d btn-danger btn-sm text-xs py-1 px-3 pointer-events-none opacity-80 flex items-center gap-1">
          <AlertCircle size={12} />
          Expired
        </span>
      );
    }
    if (status === 'soon') {
      return (
        <span className="btn-3d btn-secondary btn-sm text-xs py-1 px-3 pointer-events-none bg-amber-600 shadow-none flex items-center gap-1">
          <Clock size={12} />
          Coming Soon
        </span>
      );
    }
    return (
      <span className="btn-3d btn-wa btn-sm text-xs py-1 px-3.5 flex items-center gap-1.5 font-bold">
        <CheckCircle2 size={13} />
        Click Here
      </span>
    );
  };

  return (
    <motion.div 
      id="post-detail-layout" 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto py-6 px-4 print:p-0"
    >
      {/* Back button & Action Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0056b3] hover:text-[#003773] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs transition-all cursor-pointer hover:shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to All Updates</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            title="Print or Save PDF"
            className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer size={15} />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            title="Copy Page Link"
            className="p-2 text-slate-600 hover:text-[#0056b3] bg-white hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
          >
            {isCopied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          {/* Save Bookmark */}
          <button
            onClick={handleToggleBookmark}
            title={isSaved ? "Saved" : "Save this update"}
            className={`p-2 rounded-xl border transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 ${
              isSaved
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={15} className={isSaved ? "fill-amber-600 text-amber-600" : ""} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Post Header Block */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-6 text-center relative overflow-hidden">
        <div className="inline-block px-3.5 py-1 bg-blue-100 text-[#0056b3] text-xs font-black rounded-full uppercase tracking-wider mb-3">
          {post.category}
        </div>
        
        <h1 id="post-title" className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-snug">
          {post.title}
        </h1>

        {/* Highlight Stats (Last Date, Vacancies, Qualification) */}
        {(post.lastDate || post.totalVacancies || post.qualification || post.salaryInfo) && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {post.lastDate && (
              <span className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Clock size={13} className="text-rose-600" />
                <span>Last Date: <strong>{post.lastDate}</strong></span>
              </span>
            )}
            {post.totalVacancies && (
              <span className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Users size={13} className="text-blue-600" />
                <span>Total Posts: <strong>{post.totalVacancies}</strong></span>
              </span>
            )}
            {post.qualification && (
              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <GraduationCap size={13} className="text-blue-600" />
                <span>Qualification: <strong>{post.qualification}</strong></span>
              </span>
            )}
            {post.salaryInfo && (
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5">
                <IndianRupee size={13} className="text-emerald-600" />
                <span>Salary: <strong>{post.salaryInfo}</strong></span>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-500 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Calendar size={15} className="text-[#0056b3]" />
            <span>Published: <strong className="text-slate-700">{formattedDate}</strong></span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1.5">
            <Eye size={15} className="text-[#0056b3]" />
            <span>Total Views: <strong className="text-slate-700">{post.views}</strong></span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck size={15} />
            <span>Verified Official</span>
          </span>
        </div>
      </div>

      {/* Monetag Native Ad Slot Top */}
      {monetagEnabled && (
        <div className="mb-6 print:hidden">
          <MonetagSlot slotType="detail" monetagEnabled={monetagEnabled} zoneCode={monetagZoneCode} label="Sponsored Career Partner" />
        </div>
      )}

      {/* Quick Summary Info Table */}
      {post.quickInfo && post.quickInfo.length > 0 && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
          <div className="box-heading">
            <span>📋</span>
            <span>Important Details & Key Summary</span>
          </div>
          <div className="overflow-x-auto">
            <table className="classic-info-table w-full">
              <tbody>
                {post.quickInfo.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <th className="w-1/3 text-left py-3 px-4 text-xs sm:text-sm font-bold text-slate-900 border-r border-slate-200">
                      {row.key}
                    </th>
                    <td className="text-slate-800 font-medium py-3 px-4 text-xs sm:text-sm">
                      {row.val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview Short Description */}
      {post.summary && (
        <div className="bg-gradient-to-r from-blue-50/90 to-sky-50/60 border-l-4 border-[#0056b3] p-4 sm:p-5 rounded-r-xl mb-8 shadow-xs">
          <h3 className="text-xs sm:text-sm font-black text-[#0056b3] uppercase tracking-wider mb-1">
            Short Overview & Briefing
          </h3>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
            {post.summary}
          </p>
        </div>
      )}

      {/* Main Article Content Body */}
      {post.body && (
        <article className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm mb-8">
          <h2 className="text-base sm:text-lg font-black text-slate-900 pb-3 mb-4 border-b border-slate-200 flex items-center gap-2">
            <span>📝</span>
            <span>Full Details, Eligibility & Instructions</span>
          </h2>
          <div 
            className="prose prose-slate max-w-none text-slate-800 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>
      )}

      {/* Important Direct Links Table */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
        <div className="box-heading">
          <span>🔗</span>
          <span>Important Official Direct Links</span>
        </div>
        <div className="overflow-x-auto">
          <table className="links-table w-full">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider">
                <th className="text-left py-3 px-4">Link Title</th>
                <th className="text-center py-3 px-4 w-44">Direct Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {post.importantLinks && post.importantLinks.length > 0 ? (
                post.importantLinks.map((link, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="font-bold text-slate-800 text-xs sm:text-sm py-3 px-4">
                      {link.label}
                    </td>
                    <td className="text-center py-3 px-4">
                      {link.status === 'expired' ? (
                        getLinkStatusBadge('expired')
                      ) : link.status === 'soon' ? (
                        getLinkStatusBadge('soon')
                      ) : (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block hover:scale-105 transition-transform"
                        >
                          {getLinkStatusBadge('active')}
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center text-slate-400 py-4 text-sm">
                    No external links provided.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monetag Native Ad Slot Bottom */}
      {monetagEnabled && (
        <div className="mb-8 print:hidden">
          <MonetagSlot slotType="footer" monetagEnabled={monetagEnabled} zoneCode={monetagZoneCode} label="Sponsored Partner" />
        </div>
      )}

      {/* WhatsApp Share & CTA Box */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-dashed border-[#0056b3] rounded-2xl p-6 sm:p-8 text-center mb-10 shadow-xs print:hidden">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
          📢 Share This Alert With Aspirants
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 max-w-md mx-auto">
          Help your friends and batchmates get single-click verified notification updates instantly on WhatsApp!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleShareWhatsApp}
            className="btn-3d btn-wa py-2.5 px-5 text-sm font-bold flex items-center gap-2"
          >
            <Share2 size={16} />
            Share on WhatsApp
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href={mainWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d btn-primary py-2.5 px-5 text-sm font-bold flex items-center gap-2"
          >
            <ExternalLink size={16} />
            Join WhatsApp Channel
          </motion.a>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-200 print:hidden">
          <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
            <span>🔥</span>
            <span>Related {post.category} Updates</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedPosts.map((rel) => (
              <motion.div
                key={rel.id}
                whileHover={{ y: -3 }}
                onClick={() => onSelectPost(rel.id)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-black text-[#0056b3] uppercase tracking-wider mb-1 block">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mb-2 hover:text-[#0056b3]">
                    {rel.title}
                  </h4>
                </div>
                <button
                  className="btn-3d btn-primary btn-sm w-full mt-2 text-xs font-bold py-1.5"
                >
                  Read Update
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
