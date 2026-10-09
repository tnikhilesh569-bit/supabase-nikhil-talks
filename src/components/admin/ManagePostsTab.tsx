import React, { useState } from 'react';
import { 
  Search, 
  Star, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  CheckSquare, 
  Square, 
  Download, 
  Clock, 
  X, 
  ExternalLink,
  Plus
} from 'lucide-react';
import { Post } from '../../types';

interface ManagePostsTabProps {
  posts: Post[];
  onStartEdit: (post: Post) => void;
  onDuplicate: (post: Post) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkPin: (ids: string[], isPinned: boolean) => void;
  onTogglePin: (post: Post) => void;
  onToggleDraft: (post: Post) => void;
  onCreateNew: () => void;
}

export const ManagePostsTab: React.FC<ManagePostsTabProps> = ({
  posts,
  onStartEdit,
  onDuplicate,
  onDelete,
  onBulkDelete,
  onBulkPin,
  onTogglePin,
  onToggleDraft,
  onCreateNew
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'pinned'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
    
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    let matchesStatus = true;
    if (statusFilter === 'draft') matchesStatus = !!p.isDraft;
    if (statusFilter === 'published') matchesStatus = !p.isDraft;
    if (statusFilter === 'pinned') matchesStatus = !!p.isPinned;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Bulk Selection Handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPosts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected posts permanently?`)) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkPinAction = (isPinned: boolean) => {
    if (selectedIds.length === 0) return;
    onBulkPin(selectedIds, isPinned);
    setSelectedIds([]);
  };

  const handleExportCsv = () => {
    const headers = ["ID", "Title", "Category", "Views", "LastDate", "Pinned", "Draft", "CreatedAt"];
    const rows = filteredPosts.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.category,
      p.views || 0,
      p.lastDate || '',
      p.isPinned ? "Yes" : "No",
      p.isDraft ? "Yes" : "No",
      p.createdAt || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nikhil_talks_posts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Manage All Published & Draft Posts</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600/30 text-blue-300 text-xs font-black">
              {filteredPosts.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, batch pin/unpin, duplicate, edit, or remove portal alerts in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onCreateNew}
            className="btn-3d btn-primary btn-sm text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create New Post</span>
          </button>
          <button
            onClick={handleExportCsv}
            title="Export view to CSV"
            className="btn-3d btn-secondary btn-sm text-xs font-bold py-2 px-3 flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/80">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, keywords or tag..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Jobs">Jobs</option>
          <option value="Notices">Notices</option>
          <option value="Scholarships">Scholarships</option>
          <option value="Sarkari Yojna">Sarkari Yojna</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published Live</option>
          <option value="draft">Drafts Only</option>
          <option value="pinned">Pinned Featured</option>
        </select>
      </div>

      {/* Bulk Action Controls Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-950/60 border border-blue-800/80 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-200">
            <span>{selectedIds.length} posts selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkPinAction(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer"
            >
              ⭐ Bulk Pin
            </button>
            <button
              onClick={() => handleBulkPinAction(false)}
              className="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-200 text-xs font-bold border border-slate-600 hover:bg-slate-600 cursor-pointer"
            >
              Bulk Unpin
            </button>
            <button
              onClick={handleBulkDeleteConfirm}
              className="btn-3d btn-danger btn-sm text-xs py-1 px-3 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Bulk Delete ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-700">
              <th className="py-3 px-3 w-8 text-center">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-400 hover:text-white cursor-pointer"
                  title="Select All"
                >
                  {selectedIds.length > 0 && selectedIds.length === filteredPosts.length ? (
                    <CheckSquare size={15} className="text-blue-400" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
              <th className="py-3 px-3">Post Title</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Last Date</th>
              <th className="py-3 px-3">Views</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 bg-slate-900/30">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  No posts match your filters. Try clearing search criteria.
                </td>
              </tr>
            ) : (
              filteredPosts.map(post => {
                const isSelected = selectedIds.includes(post.id);
                return (
                  <tr 
                    key={post.id} 
                    className={`hover:bg-slate-700/30 transition-colors ${
                      isSelected ? 'bg-blue-900/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(post.id)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare size={15} className="text-blue-400" />
                        ) : (
                          <Square size={15} />
                        )}
                      </button>
                    </td>
                    {/* Title */}
                    <td className="py-3 px-3 font-semibold text-white max-w-sm">
                      <div className="truncate font-bold text-slate-100 hover:text-sky-400 cursor-pointer" onClick={() => onStartEdit(post)}>
                        {post.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>ID: {post.id}</span>
                        {post.qualification && <span>• {post.qualification}</span>}
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-3 px-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-extrabold uppercase border border-slate-700">
                        {post.category}
                      </span>
                    </td>
                    {/* Last Date */}
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {post.lastDate ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <Clock size={11} />
                          <span>{post.lastDate}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    {/* Views */}
                    <td className="py-3 px-3 text-emerald-400 font-bold font-mono">
                      {post.views || 0}
                    </td>
                    {/* Status & Pin */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {post.isDraft ? (
                          <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            Live
                          </span>
                        )}
                        {post.isPinned && (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                            ⭐ Pinned
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {/* Preview Modal */}
                      <button
                        onClick={() => setPreviewPost(post)}
                        title="Quick Preview"
                        className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <Eye size={14} />
                      </button>
                      {/* Toggle Pin */}
                      <button
                        onClick={() => onTogglePin(post)}
                        title={post.isPinned ? "Unpin post" : "Pin post to top"}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <Star size={14} className={post.isPinned ? "fill-amber-400 text-amber-400" : ""} />
                      </button>
                      {/* Duplicate */}
                      <button
                        onClick={() => onDuplicate(post)}
                        title="Duplicate Post"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <Copy size={14} />
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => onStartEdit(post)}
                        title="Edit Full Post"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <Edit size={14} />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                            onDelete(post.id);
                          }
                        }}
                        title="Delete Post"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setPreviewPost(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-blue-600 text-white">
                {previewPost.category}
              </span>
              {previewPost.isPinned && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  ⭐ Pinned Featured
                </span>
              )}
            </div>
            <h3 className="text-lg font-black text-white">{previewPost.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-xl">
              {previewPost.summary}
            </p>
            {previewPost.quickInfo && previewPost.quickInfo.length > 0 && (
              <div className="border border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-800 px-3 py-2 font-bold text-slate-200">
                  Quick Details Table
                </div>
                <div className="divide-y divide-slate-800">
                  {previewPost.quickInfo.map((r, i) => (
                    <div key={i} className="flex px-3 py-2">
                      <span className="w-1/3 font-bold text-slate-400">{r.key}</span>
                      <span className="w-2/3 text-white">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {previewPost.importantLinks && previewPost.importantLinks.length > 0 && (
              <div className="border border-slate-700 rounded-xl overflow-hidden text-xs">
                <div className="bg-slate-800 px-3 py-2 font-bold text-slate-200">
                  Official Links
                </div>
                <div className="divide-y divide-slate-800">
                  {previewPost.importantLinks.map((l, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2">
                      <span className="font-bold text-slate-300">{l.label}</span>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                        <span>Open Link</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const p = previewPost;
                  setPreviewPost(null);
                  onStartEdit(p);
                }}
                className="btn-3d btn-primary btn-sm text-xs font-bold py-2 px-4 cursor-pointer"
              >
                Edit This Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
