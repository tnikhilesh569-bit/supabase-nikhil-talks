import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  ShoppingBag, 
  Bell, 
  Settings, 
  LogOut, 
  Plus, 
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  DollarSign,
  AlertTriangle,
  MessageCircle,
  Menu,
  X,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, MarketplaceItem, NoticeSettings } from '../types';
import { getAuditLogs } from '../lib/supabase';
import { AnalyticsTab } from './admin/AnalyticsTab';
import { PostEditorTab } from './admin/PostEditorTab';
import { ManagePostsTab } from './admin/ManagePostsTab';
import { MarketplaceTab } from './admin/MarketplaceTab';
import { WhatsAppBroadcastTab } from './admin/WhatsAppBroadcastTab';
import { NoticesTab } from './admin/NoticesTab';
import { MonetagTab } from './admin/MonetagTab';
import { SettingsTab } from './admin/SettingsTab';

interface AdminDashboardProps {
  posts: Post[];
  marketplace: MarketplaceItem[];
  settings: NoticeSettings;
  adminUser: { email: string } | null;
  onLogin: (emailOrUsername: string, pass: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onSavePost: (post: Omit<Post, 'id' | 'views' | 'createdAt'> & { id?: string; views?: number }) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
  onBulkDeletePosts?: (ids: string[]) => Promise<void>;
  onBulkPinPosts?: (ids: string[], isPinned: boolean) => Promise<void>;
  onUpdateMarketStatus: (id: string, status: 'approved' | 'rejected' | 'sold') => Promise<void>;
  onDeleteMarketItem: (id: string) => Promise<void>;
  onUpdateMarketDetails?: (id: string, details: Partial<MarketplaceItem>) => Promise<void>;
  onSubmitMarketListing?: (data: Omit<MarketplaceItem, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  onSaveSettings: (settings: Partial<NoticeSettings>) => Promise<void>;
  onBackToPortal: () => void;
}

export type AdminTab = 
  | 'analytics' 
  | 'create_post' 
  | 'manage_posts' 
  | 'marketplace' 
  | 'broadcast' 
  | 'notices' 
  | 'monetag' 
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  posts,
  marketplace,
  settings,
  adminUser,
  onLogin,
  onLogout,
  onSavePost,
  onDeletePost,
  onBulkDeletePosts,
  onBulkPinPosts,
  onUpdateMarketStatus,
  onDeleteMarketItem,
  onUpdateMarketDetails,
  onSubmitMarketListing,
  onSaveSettings,
  onBackToPortal
}) => {
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Nav & State
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pendingListingsCount = marketplace.filter(m => m.status === 'pending').length;
  const auditLogs = getAuditLogs();

  // Login Handler
  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await onLogin(loginIdentifier, loginPass);
    } catch (err: any) {
      setLoginError(err?.message || 'Invalid admin username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Start Editing Post
  const handleStartEditPost = (post: Post) => {
    setEditingPost(post);
    setActiveTab('create_post');
    setIsMobileSidebarOpen(false);
  };

  // Duplicate Post
  const handleDuplicatePost = async (post: Post) => {
    await onSavePost({
      title: `${post.title} (Copy)`,
      category: post.category,
      tags: post.tags || [],
      summary: post.summary || '',
      body: post.body || '',
      isPinned: false,
      isDraft: true,
      lastDate: post.lastDate || '',
      qualification: post.qualification || '',
      salaryInfo: post.salaryInfo || '',
      totalVacancies: post.totalVacancies || '',
      quickInfo: post.quickInfo || [],
      importantLinks: post.importantLinks || []
    });
    alert(`Duplicated "${post.title}" as Draft successfully!`);
  };

  // Toggle Pin
  const handleTogglePin = async (post: Post) => {
    await onSavePost({
      ...post,
      isPinned: !post.isPinned
    });
  };

  // Toggle Draft
  const handleToggleDraft = async (post: Post) => {
    await onSavePost({
      ...post,
      isDraft: !post.isDraft
    });
  };

  // If Not Logged In, Render Secure Admin Login Screen
  if (!adminUser) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-900">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-800 border border-slate-700 w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl relative"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600/20 text-[#38bdf8] border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Nikhil Talks Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Secure control console for posts, Monetag ad monetization & marketplace
            </p>
          </div>

          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2"
            >
              <AlertTriangle size={15} className="shrink-0" />
              <span>{loginError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLoginFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Admin Username or Email
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder='Enter admin username or email'
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] outline-none pr-10"
                />
                <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoggingIn}
              className="btn-3d btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={16} />
              <span>{isLoggingIn ? 'Verifying Access...' : 'Sign In'}</span>
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/80 flex items-center justify-center text-xs">
            <button
              type="button"
              onClick={onBackToPortal}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Portal</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-emerald-400" />
          <span className="font-black text-white text-base">Nikhil Talks Admin</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 cursor-pointer"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 md:static
        ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand & User info */}
          <div className="pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-emerald-400" />
              <span className="font-black text-white text-base tracking-wide">Nikhil Talks Admin</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate font-semibold text-emerald-400">{adminUser.email}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => { setActiveTab('analytics'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <BarChart3 size={16} />
              <span>Live Analytics</span>
            </button>

            <button
              onClick={() => { 
                setEditingPost(null); 
                setActiveTab('create_post'); 
                setIsMobileSidebarOpen(false); 
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'create_post' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Plus size={16} />
              <span>{editingPost ? 'Edit Post' : 'Post Creator (Rich)'}</span>
            </button>

            <button
              onClick={() => { setActiveTab('manage_posts'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'manage_posts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} />
                <span>Manage Posts</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-black">
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('marketplace'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'marketplace' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} />
                <span>Marketplace Hub</span>
              </div>
              {pendingListingsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-black">
                  {pendingListingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('broadcast'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'broadcast' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:bg-slate-800/80'
              }`}
            >
              <MessageCircle size={16} />
              <span>WA Broadcast Generator</span>
            </button>

            <button
              onClick={() => { setActiveTab('notices'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'notices' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Bell size={16} />
              <span>Alerts & WhatsApp</span>
            </button>

            <button
              onClick={() => { setActiveTab('monetag'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'monetag' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-400 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign size={16} />
                <span>Monetag Ads Config</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800">
                ACTIVE
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Settings size={16} />
              <span>Backup & Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToPortal}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Tab Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-6xl">
        {activeTab === 'analytics' && (
          <AnalyticsTab
            posts={posts}
            marketplace={marketplace}
            auditLogs={auditLogs}
            onNavigateTab={setActiveTab}
            onEditPost={handleStartEditPost}
          />
        )}
        {activeTab === 'create_post' && (
          <PostEditorTab
            editingPostId={editingPost?.id || null}
            initialPost={editingPost}
            onSavePost={async (data) => {
              await onSavePost(data);
              setEditingPost(null);
              setActiveTab('manage_posts');
            }}
            onCancel={() => {
              setEditingPost(null);
              setActiveTab('manage_posts');
            }}
          />
        )}
        {activeTab === 'manage_posts' && (
          <ManagePostsTab
            posts={posts}
            onStartEdit={handleStartEditPost}
            onDuplicate={handleDuplicatePost}
            onDelete={onDeletePost}
            onBulkDelete={async (ids) => {
              if (onBulkDeletePosts) {
                await onBulkDeletePosts(ids);
              } else {
                for (const id of ids) await onDeletePost(id);
              }
            }}
            onBulkPin={async (ids, isPinned) => {
              if (onBulkPinPosts) {
                await onBulkPinPosts(ids, isPinned);
              }
            }}
            onTogglePin={handleTogglePin}
            onToggleDraft={handleToggleDraft}
            onCreateNew={() => {
              setEditingPost(null);
              setActiveTab('create_post');
            }}
          />
        )}
        {activeTab === 'marketplace' && (
          <MarketplaceTab
            marketplace={marketplace}
            onUpdateStatus={onUpdateMarketStatus}
            onDeleteListing={onDeleteMarketItem}
            onUpdateDetails={onUpdateMarketDetails}
            onSubmitListing={onSubmitMarketListing || (async () => {})}
          />
        )}
        {activeTab === 'broadcast' && (
          <WhatsAppBroadcastTab
            posts={posts}
            mainWaUrl={settings.mainWaUrl}
          />
        )}
        {activeTab === 'notices' && (
          <NoticesTab
            settings={settings}
            onSaveSettings={onSaveSettings}
          />
        )}
        {activeTab === 'monetag' && (
          <MonetagTab
            settings={settings}
            onSaveSettings={onSaveSettings}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            posts={posts}
            marketplace={marketplace}
            settings={settings}
            auditLogs={auditLogs}
            onSaveSettings={onSaveSettings}
          />
        )}
      </main>
    </div>
  );
};
