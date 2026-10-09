import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Post, 
  MarketplaceItem, 
  NoticeSettings, 
  PostCategory 
} from './types';
import { 
  getInitialPosts, 
  getInitialMarketplace, 
  getNoticeSettings, 
  saveNoticeSettings,
  savePostToStorage,
  deletePostFromStorage,
  saveMarketItemToStorage,
  deleteMarketItemFromStorage,
  updateMarketItemStatusInStorage,
  incrementPostViewCount,
  performAdminLogin,
  performAdminLogout,
  getStoredAdminSession,
  fetchAllPosts,
  fetchMarketplace,
  fetchNoticeSettings
} from './lib/supabase';
import { 
  getBookmarks, 
  toggleBookmark as toggleBookmarkInStore 
} from './lib/bookmarks';

// UI Components
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { PostsGrid } from './components/PostsGrid';
import { PostDetailView } from './components/PostDetailView';
import { MarketplaceSection } from './components/MarketplaceSection';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { MonetagSlot } from './components/MonetagSlot';

export const App: React.FC = () => {
  // Global Data State
  const [posts, setPosts] = useState<Post[]>(() => getInitialPosts());
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(() => getInitialMarketplace());
  const [settings, setSettings] = useState<NoticeSettings>(() => getNoticeSettings());
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(() => getStoredAdminSession());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarks());

  // Navigation & View Routing State
  const [currentView, setCurrentView] = useState<'home' | 'post' | 'marketplace' | 'admin'>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState<'All' | PostCategory>('All');
  const [selectedQualification, setSelectedQualification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load shared content from Supabase while retaining local cached content for offline startup.
  useEffect(() => {
    let active = true;
    Promise.all([fetchAllPosts(), fetchMarketplace(), fetchNoticeSettings()]).then(([remotePosts, remoteMarket, remoteSettings]) => {
      if (!active) return;
      if (remotePosts.length) setPosts(remotePosts);
      if (remoteMarket.length) setMarketplace(remoteMarket);
      setSettings(remoteSettings);
    }).catch((error) => console.error('Unable to refresh Supabase content:', error));
    return () => { active = false; };
  }, []);

  // Listen to bookmarks updates
  useEffect(() => {
    const handleBookmarkSync = () => {
      setBookmarkedIds(getBookmarks());
    };
    window.addEventListener('bookmarks_updated', handleBookmarkSync);
    return () => window.removeEventListener('bookmarks_updated', handleBookmarkSync);
  }, []);

  // URL Hash & Query Param Synchronization
  useEffect(() => {
    const handleUrlRouting = () => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('id');
      const viewParam = params.get('view');
      const catParam = params.get('cat');

      if (postId) {
        const found = posts.find(p => p.id === postId);
        if (found) {
          setSelectedPost(found);
          setCurrentView('post');
          return;
        }
      }

      if (viewParam === 'admin') {
        setCurrentView('admin');
      } else if (viewParam === 'marketplace') {
        setCurrentView('marketplace');
      } else if (catParam && ['Jobs', 'Notices', 'Scholarships', 'Sarkari Yojna'].includes(catParam)) {
        setSelectedCategory(catParam as PostCategory);
        setCurrentView('home');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => window.removeEventListener('popstate', handleUrlRouting);
  }, [posts]);

  // Navigate View with URL sync
  const handleNavigate = (view: 'home' | 'post' | 'marketplace' | 'admin', category?: PostCategory) => {
    setCurrentView(view);
    if (category) {
      setSelectedCategory(category);
    }
    if (view === 'home') {
      setSelectedPost(null);
      window.history.pushState({}, '', window.location.pathname);
    } else if (view === 'admin') {
      window.history.pushState({}, '', '?view=admin');
    } else if (view === 'marketplace') {
      window.history.pushState({}, '', '?view=marketplace');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Post to Read Details
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('post');
    window.history.pushState({}, '', `?id=${post.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Increment View Count
    incrementPostViewCount(post.id).then(newViews => {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, views: newViews } : p));
      setSelectedPost(prev => prev && prev.id === post.id ? { ...prev, views: newViews } : prev);
    });
  };

  // Admin Auth Handlers
  const handleAdminLogin = async (emailOrUsername: string, pass: string) => {
    const user = await performAdminLogin(emailOrUsername, pass);
    setAdminUser(user);
  };

  const handleAdminLogout = async () => {
    await performAdminLogout();
    setAdminUser(null);
  };

  // Post Data Operations
  const handleSavePost = async (postData: Omit<Post, 'id' | 'views' | 'createdAt'> & { id?: string; views?: number }) => {
    const saved = await savePostToStorage(postData);
    setPosts(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  const handleDeletePost = async (id: string) => {
    await deletePostFromStorage(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    if (selectedPost?.id === id) {
      setSelectedPost(null);
      setCurrentView('home');
    }
  };

  const handleBulkDeletePosts = async (ids: string[]) => {
    for (const id of ids) {
      await deletePostFromStorage(id);
    }
    setPosts(prev => prev.filter(p => !ids.includes(p.id)));
  };

  const handleBulkPinPosts = async (ids: string[], isPinned: boolean) => {
    for (const id of ids) {
      const p = posts.find(item => item.id === id);
      if (p) {
        await savePostToStorage({ ...p, isPinned });
      }
    }
    setPosts(prev => prev.map(p => ids.includes(p.id) ? { ...p, isPinned } : p));
  };

  // Marketplace Operations
  const handleUpdateMarketStatus = async (id: string, status: 'approved' | 'rejected' | 'sold') => {
    await updateMarketItemStatusInStorage(id, status);
    setMarketplace(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const handleDeleteMarketItem = async (id: string) => {
    await deleteMarketItemFromStorage(id);
    setMarketplace(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMarketDetails = async (id: string, details: Partial<MarketplaceItem>) => {
    const item = marketplace.find(m => m.id === id);
    if (!item) return;
    const updated = { ...item, ...details };
    await saveMarketItemToStorage(updated);
    setMarketplace(prev => prev.map(m => m.id === id ? updated : m));
  };

  const handleSubmitMarketListing = async (data: Omit<MarketplaceItem, 'id' | 'status' | 'createdAt'>) => {
    const newItem = await saveMarketItemToStorage({
      ...data,
      status: adminUser ? 'approved' : 'pending'
    });
    setMarketplace(prev => [newItem, ...prev]);
  };

  // Settings Save
  const handleSaveSettings = async (newSettings: Partial<NoticeSettings>) => {
    await saveNoticeSettings(newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      All: posts.filter(p => !p.isDraft || adminUser).length,
      Jobs: posts.filter(p => p.category === 'Jobs' && (!p.isDraft || adminUser)).length,
      Notices: posts.filter(p => p.category === 'Notices' && (!p.isDraft || adminUser)).length,
      Scholarships: posts.filter(p => p.category === 'Scholarships' && (!p.isDraft || adminUser)).length,
      'Sarkari Yojna': posts.filter(p => p.category === 'Sarkari Yojna' && (!p.isDraft || adminUser)).length,
    };
  }, [posts, adminUser]);

  // Filtered Posts Calculation
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Drafts hidden from public view unless admin
      if (post.isDraft && !adminUser) return false;

      // Category filter
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }

      // Qualification filter
      if (selectedQualification !== 'all') {
        const postQual = (post.qualification || '').toLowerCase();
        const targetQual = selectedQualification.toLowerCase();
        if (!postQual.includes(targetQual)) {
          return false;
        }
      }

      // Bookmarks filter
      if (showBookmarksOnly && !bookmarkedIds.includes(post.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesSummary = post.summary.toLowerCase().includes(q);
        const matchesTags = post.tags?.some(t => t.toLowerCase().includes(q));
        const matchesCategory = post.category.toLowerCase().includes(q);
        return matchesTitle || matchesSummary || matchesTags || matchesCategory;
      }

      return true;
    });
  }, [posts, adminUser, selectedCategory, selectedQualification, showBookmarksOnly, bookmarkedIds, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#0056b3] selection:text-white">
      {/* Top Header & Alert Banners */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        marqueeText={settings.marqueeText || ''}
        marqueeEnabled={settings.marqueeEnabled}
        emergencyAlert={settings.emergencyAlert}
        mainWaUrl={settings.mainWaUrl || 'https://whatsapp.com/channel/0029Va9y6b46x4m87f9'}
        onSelectSavedView={() => {
          setShowBookmarksOnly(true);
          setCurrentView('home');
        }}
      />

      {/* Main App Content View Routing */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Hero Search Section */}
              <HeroSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                totalPostsCount={filteredPosts.length}
                onTagClick={(tag: string) => setSearchQuery(tag)}
              />

              {/* Category & Qualification Tabs */}
              <CategoryFilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
                isSavedFilterActive={showBookmarksOnly}
                onToggleSavedFilter={() => setShowBookmarksOnly(prev => !prev)}
                savedCount={bookmarkedIds.length}
                selectedQualification={selectedQualification}
                onSelectQualification={setSelectedQualification}
              />

              {/* Monetag Header Native Slot */}
              {settings.monetagEnabled && (
                <div className="max-w-7xl mx-auto px-4 pt-1 pb-3">
                  <MonetagSlot 
                    zoneCode={settings.monetagZoneCode || '11853011'}
                    slotType="header"
                    monetagEnabled={settings.monetagEnabled}
                    className="max-w-4xl mx-auto"
                  />
                </div>
              )}

              {/* Main Content Posts Grid */}
              <div className="max-w-7xl mx-auto px-4 pb-12">
                <PostsGrid
                  posts={filteredPosts}
                  onSelectPost={(id: string) => {
                    const found = posts.find(p => p.id === id);
                    if (found) handleSelectPost(found);
                  }}
                />
              </div>

              {/* Student Utility Marketplace Section */}
              <MarketplaceSection
                items={marketplace}
                onSubmitAd={handleSubmitMarketListing}
              />
            </motion.div>
          )}

          {currentView === 'post' && selectedPost && (
            <motion.div
              key={`post-view-${selectedPost.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <PostDetailView
                post={selectedPost}
                relatedPosts={posts.filter(p => p.id !== selectedPost.id && p.category === selectedPost.category)}
                onBack={() => handleNavigate('home')}
                onSelectPost={(id: string) => {
                  const found = posts.find(p => p.id === id);
                  if (found) handleSelectPost(found);
                }}
                mainWaUrl={settings.mainWaUrl || 'https://whatsapp.com/channel/0029Va9y6b46x4m87f9'}
                monetagEnabled={settings.monetagEnabled}
                monetagZoneCode={settings.monetagZoneCode}
              />
            </motion.div>
          )}

          {currentView === 'marketplace' && (
            <motion.div
              key="marketplace-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pt-4">
                <MarketplaceSection
                  items={marketplace}
                  onSubmitAd={handleSubmitMarketListing}
                />
              </div>
            </motion.div>
          )}

          {currentView === 'admin' && (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AdminDashboard
                posts={posts}
                marketplace={marketplace}
                settings={settings}
                adminUser={adminUser}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
                onSavePost={handleSavePost}
                onDeletePost={handleDeletePost}
                onBulkDeletePosts={handleBulkDeletePosts}
                onBulkPinPosts={handleBulkPinPosts}
                onUpdateMarketStatus={handleUpdateMarketStatus}
                onDeleteMarketItem={handleDeleteMarketItem}
                onUpdateMarketDetails={handleUpdateMarketDetails}
                onSubmitMarketListing={handleSubmitMarketListing}
                onSaveSettings={handleSaveSettings}
                onBackToPortal={() => handleNavigate('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Join WhatsApp CTA Button */}
      {currentView !== 'admin' && (
        <FloatingWhatsApp url={settings.mainWaUrl || 'https://whatsapp.com/channel/0029Va9y6b46x4m87f9'} />
      )}

      {/* Footer */}
      {currentView !== 'admin' && (
        <Footer
          aboutText={settings.aboutText || ''}
          onNavigate={handleNavigate}
          mainWaUrl={settings.mainWaUrl || 'https://whatsapp.com/channel/0029Va9y6b46x4m87f9'}
          ch1={settings.ch1}
          ch2={settings.ch2}
          ch3={settings.ch3}
          ch4={settings.ch4}
        />
      )}
    </div>
  );
};

export default App;
