import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Eye, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  Clock, 
  AlertTriangle, 
  Plus, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Post, MarketplaceItem, PostCategory, AdminAuditLog } from '../../types';

interface AnalyticsTabProps {
  posts: Post[];
  marketplace: MarketplaceItem[];
  auditLogs: AdminAuditLog[];
  onNavigateTab: (tab: any) => void;
  onEditPost: (post: Post) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  posts,
  marketplace,
  auditLogs,
  onNavigateTab,
  onEditPost
}) => {
  const pendingListings = marketplace.filter(m => m.status === 'pending');
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const draftsCount = posts.filter(p => p.isDraft).length;
  const pinnedCount = posts.filter(p => p.isPinned).length;

  // Calculate upcoming deadlines (within 7 days) and expired
  const now = new Date().getTime();
  const expiringSoonPosts: Array<{ post: Post; daysLeft: number }> = [];
  const expiredPosts: Post[] = [];

  posts.forEach(p => {
    if (p.lastDate) {
      try {
        const deadline = new Date(p.lastDate).getTime();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) {
          expiredPosts.push(p);
        } else if (diffDays <= 7) {
          expiringSoonPosts.push({ post: p, daysLeft: diffDays });
        }
      } catch {}
    }
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-white">Live Platform Analytics</h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-400">Real-time overview of Nikhil Talks visitors, views, content health, and activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('create_post')}
            className="btn-3d btn-primary btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New Post</span>
          </button>
          <button
            onClick={() => onNavigateTab('broadcast')}
            className="btn-3d btn-wa btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <span>📱 WA Broadcast</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Published Posts</span>
            <FileText size={18} className="text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{posts.length}</div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
            <span>{pinnedCount} Pinned</span>
            <span>•</span>
            <span className="text-amber-400">{draftsCount} Drafts</span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Aspirant Views</span>
            <Eye size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalViews.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Verified notification reads</span>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Review</span>
            <ShoppingBag size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{pendingListings.length}</div>
          <div className="text-[11px] text-amber-400 mt-1">
            {pendingListings.length > 0 ? '⚠️ Action needed in marketplace' : 'All listings approved'}
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl shadow-lg hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Monetag Ads</span>
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">Monetag Live</div>
          <div className="text-[11px] text-slate-400 mt-1">Zone 11853011 + In-page Push Active</div>
        </div>
      </div>

      {/* Deadline Health Alerts Banner */}
      {(expiringSoonPosts.length > 0 || expiredPosts.length > 0) && (
        <div className="bg-amber-950/40 border border-amber-800/80 p-4 sm:p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
              <AlertTriangle size={17} className="text-amber-400" />
              <span>Application Deadline Monitor (Automated Alert)</span>
            </div>
            <span className="text-[11px] text-amber-400 font-bold">
              {expiringSoonPosts.length} closing soon • {expiredPosts.length} expired
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
            {expiringSoonPosts.map(({ post, daysLeft }) => (
              <div 
                key={post.id}
                onClick={() => onEditPost(post)}
                className="bg-slate-900/90 border border-amber-700/50 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800"
              >
                <div className="truncate pr-2">
                  <span className="text-xs font-bold text-white block truncate">{post.title}</span>
                  <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                    <Clock size={11} /> Last Date: {post.lastDate}
                  </span>
                </div>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black rounded-lg shrink-0 border border-amber-500/40">
                  {daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}
                </span>
              </div>
            ))}
            {expiredPosts.slice(0, 2).map(post => (
              <div 
                key={post.id}
                onClick={() => onEditPost(post)}
                className="bg-slate-900/90 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800 opacity-80"
              >
                <div className="truncate pr-2">
                  <span className="text-xs font-bold text-slate-300 block truncate">{post.title}</span>
                  <span className="text-[11px] text-slate-500">Expired on {post.lastDate}</span>
                </div>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md shrink-0">
                  Expired
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution & Top Posts Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-400" />
            <span>Category Content Distribution</span>
          </h3>
          <div className="space-y-3.5">
            {(['Jobs', 'Notices', 'Scholarships', 'Sarkari Yojna'] as PostCategory[]).map(cat => {
              const count = posts.filter(p => p.category === cat).length;
              const pct = posts.length > 0 ? Math.round((count / posts.length) * 100) : 0;
              const catViews = posts.filter(p => p.category === cat).reduce((a, b) => a + (b.views || 0), 0);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>{cat}</span>
                    </span>
                    <span className="text-slate-400">
                      {count} posts ({pct}%) • <strong className="text-emerald-400 font-mono">{catViews}</strong> views
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Viewed Posts Leaderboard */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-400" />
            <span>Top Viewed Posts (Click to Edit)</span>
          </h3>
          <div className="space-y-2.5">
            {[...posts]
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 5)
              .map((post, idx) => (
                <div
                  key={post.id}
                  onClick={() => onEditPost(post)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700/60 border border-slate-700/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                      idx === 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-blue-600/30 text-blue-300'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-200 truncate group-hover:text-sky-400 transition-colors">
                        {post.title}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {post.category} {post.isPinned && '• Featured'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-400 shrink-0 ml-2 font-mono">
                    {post.views} views
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Admin Audit Activity Feed */}
      <div className="bg-slate-800/80 border border-slate-700/80 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Recent Admin Audit Log (Last 5 Actions)</span>
          </h3>
          <button
            onClick={() => onNavigateTab('settings')}
            className="text-xs text-sky-400 font-bold hover:underline cursor-pointer"
          >
            View All Logs & Settings →
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map(log => {
            const timeFormatted = new Date(log.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
            return (
              <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-bold text-[10px] border border-blue-800/50 shrink-0">
                    {log.action}
                  </span>
                  <span className="text-slate-200 font-medium truncate">{log.target}</span>
                  {log.details && (
                    <span className="text-slate-500 text-[11px] truncate hidden sm:inline">({log.details})</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-slate-400 text-[10px] font-semibold">{log.user}</span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {timeFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
