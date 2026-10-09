import React, { useState, useEffect } from 'react';
import { Eye, Calendar, ArrowRight, Tag, Bookmark, Share2, Star, Clock, GraduationCap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post } from '../types';
import { togglePostBookmark, getBookmarkedIds } from '../lib/bookmarks';

interface PostsGridProps {
  posts: Post[];
  onSelectPost: (id: string) => void;
  isLoading?: boolean;
}

export const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  onSelectPost,
  isLoading
}) => {
  const [bookmarkedList, setBookmarkedList] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateBookmarks = () => {
      setBookmarkedList(getBookmarkedIds());
    };
    updateBookmarks();
    window.addEventListener('bookmarks_updated', updateBookmarks);
    return () => window.removeEventListener('bookmarks_updated', updateBookmarks);
  }, []);

  const handleToggleSave = (e: React.MouseEvent, postId: string, title: string) => {
    e.stopPropagation();
    const saved = togglePostBookmark(postId);
    setToastMessage(saved ? `Saved "${title.slice(0, 30)}..." to your bookmarks!` : `Removed from bookmarks.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShareWhatsApp = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    const text = encodeURIComponent(`📢 *${post.title}*\n${post.summary ? post.summary.slice(0, 120) + '...' : ''}\n\nCheck full details on Nikhil Talks:\n${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-9 h-9 border-4 border-[#0056b3] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-bold text-slate-700">Loading latest updates...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-lg mx-auto my-8 shadow-sm"
      >
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Tag size={24} />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">No updates found</h3>
        <p className="text-sm text-slate-500">
          No posts found matching your search keyword or selected filter. Try clearing filters.
        </p>
      </motion.div>
    );
  }

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Jobs':
        return 'bg-blue-600 text-white shadow-xs';
      case 'Notices':
        return 'bg-amber-600 text-white shadow-xs';
      case 'Scholarships':
        return 'bg-emerald-600 text-white shadow-xs';
      case 'Sarkari Yojna':
        return 'bg-purple-600 text-white shadow-xs';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const calculateDaysLeft = (lastDateStr?: string) => {
    if (!lastDateStr) return null;
    try {
      const deadline = new Date(lastDateStr).getTime();
      const now = new Date().getTime();
      const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Expired';
      if (diffDays === 0) return 'Last Day Today!';
      return `${diffDays} days left`;
    } catch {
      return null;
    }
  };

  return (
    <>
      {/* Dynamic Toast Feedback Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2"
          >
            <Bookmark size={14} className="text-amber-400 fill-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="posts-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {posts.map((post, index) => {
          let dateFormatted = 'Recently';
          try {
            if (post.createdAt) {
              dateFormatted = new Date(post.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
            }
          } catch {
            dateFormatted = 'Recently';
          }
          const isSaved = bookmarkedList.includes(post.id);
          const daysLeft = calculateDaysLeft(post.lastDate);

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.35) }}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group ${
                post.isPinned ? 'border-amber-400 ring-1 ring-amber-300/50 bg-gradient-to-b from-amber-50/20 to-white' : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Top Row: Category, Pinned Star, Quick Actions */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase ${getBadgeStyle(post.category)}`}>
                      {post.category}
                    </span>
                    {post.isPinned && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                        <Star size={11} className="fill-amber-500 text-amber-600" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Share Button */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleShareWhatsApp(e, post)}
                      title="Share on WhatsApp"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Share2 size={15} />
                    </motion.button>

                    {/* Bookmark Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleToggleSave(e, post.id, post.title)}
                      title={isSaved ? "Saved" : "Save for later"}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isSaved
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark size={16} className={isSaved ? "fill-amber-500 text-amber-600" : ""} />
                    </motion.button>

                    {/* Views Counter */}
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold ml-1">
                      <Eye size={13} />
                      <span>{post.views}</span>
                    </span>
                  </div>
                </div>

                {/* Deadline Countdown Pill (if available) */}
                {post.lastDate && (
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60 font-semibold w-fit">
                    <Clock size={13} className="text-rose-600" />
                    <span>Last Date: <strong>{post.lastDate}</strong></span>
                    {daysLeft && (
                      <span className="text-[10px] bg-rose-200 text-rose-900 px-1.5 py-0.2 rounded font-black uppercase">
                        {daysLeft}
                      </span>
                    )}
                  </div>
                )}

                {/* Post Title */}
                <h3
                  onClick={() => onSelectPost(post.id)}
                  className="text-base sm:text-lg font-black text-slate-900 mb-2 leading-snug line-clamp-2 group-hover:text-[#0056b3] cursor-pointer transition-colors"
                  title={post.title}
                >
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>

                {/* Mini Badges: Qualification & Vacancies */}
                {(post.qualification || post.totalVacancies) && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] font-bold">
                    {post.qualification && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                        <GraduationCap size={12} className="text-blue-600" />
                        <span>{post.qualification}</span>
                      </span>
                    )}
                    {post.totalVacancies && (
                      <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Users size={12} className="text-blue-600" />
                        <span>{post.totalVacancies}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Meta & 3D CTA Button */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    <span>{dateFormatted}</span>
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <span className="truncate max-w-[120px] text-[11px] text-slate-400 font-medium">
                      #{post.tags[0]}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectPost(post.id)}
                  className="btn-3d btn-primary w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight size={15} />
                </motion.button>
              </div>
            </motion.article>
          );
        })}
      </section>
    </>
  );
};
