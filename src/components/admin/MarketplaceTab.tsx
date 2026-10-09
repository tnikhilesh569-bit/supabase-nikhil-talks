import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  X, 
  Trash2, 
  Search, 
  Edit 
} from 'lucide-react';
import { MarketplaceItem, MarketCategory } from '../../types';

interface MarketplaceTabProps {
  marketplace: MarketplaceItem[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'sold') => Promise<void>;
  onDeleteListing: (id: string) => Promise<void>;
  onUpdateDetails?: (id: string, details: Partial<MarketplaceItem>) => Promise<void>;
  onSubmitListing: (data: Omit<MarketplaceItem, 'id' | 'status' | 'createdAt'>) => Promise<void>;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  marketplace,
  onUpdateStatus,
  onDeleteListing,
  onUpdateDetails,
  onSubmitListing
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Create Listing State
  const [adminTitle, setAdminTitle] = useState('');
  const [adminCategory, setAdminCategory] = useState<MarketCategory>('books');
  const [adminPrice, setAdminPrice] = useState<number | ''>('');
  const [adminLocation, setAdminLocation] = useState('Patna / Online');
  const [adminWhatsapp, setAdminWhatsapp] = useState('9876543210');
  const [adminDesc, setAdminDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);

  const pendingListings = marketplace.filter(m => m.status === 'pending');
  const filteredItems = marketplace.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whatsapp.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminTitle || adminPrice === '') return;
    setIsSubmitting(true);
    try {
      await onSubmitListing({
        title: adminTitle,
        category: adminCategory,
        price: Number(adminPrice),
        location: adminLocation,
        whatsapp: adminWhatsapp.replace(/\D/g, ''),
        desc: adminDesc
      });
      alert('Listing created and published successfully!');
      setAdminTitle('');
      setAdminPrice('');
      setAdminDesc('');
    } catch {
      alert('Error creating listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !onUpdateDetails) return;
    try {
      await onUpdateDetails(editingItem.id, {
        title: editingItem.title,
        price: Number(editingItem.price),
        location: editingItem.location,
        whatsapp: editingItem.whatsapp,
        desc: editingItem.desc,
        category: editingItem.category
      });
      setEditingItem(null);
      alert('Listing updated successfully!');
    } catch {
      alert('Failed to update listing.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Listing Bar */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Plus size={16} className="text-emerald-400" />
          <span>Post Official Listing as Admin (Instant Publish)</span>
        </h3>
        <form onSubmit={handleAdminCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Item Title (e.g. NCERT PCB Set / Study Table)"
              value={adminTitle}
              onChange={e => setAdminTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            />
          </div>
          <div>
            <select
              value={adminCategory}
              onChange={e => setAdminCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            >
              <option value="books">Books & Notes</option>
              <option value="gadgets">Phones & Gadgets</option>
              <option value="rooms">Room & PG</option>
              <option value="services">Micro Services</option>
            </select>
          </div>
          <div>
            <input
              type="number"
              required
              placeholder="Price in ₹ (0 for Free)"
              value={adminPrice}
              onChange={e => setAdminPrice(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Location (e.g. Patna / Online)"
              value={adminLocation}
              onChange={e => setAdminLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            />
          </div>
          <div>
            <input
              type="text"
              required
              placeholder="WhatsApp Number"
              value={adminWhatsapp}
              onChange={e => setAdminWhatsapp(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-3d btn-primary w-full py-2 text-xs font-bold bg-emerald-600 cursor-pointer"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>

      {/* Pending Queue */}
      {pendingListings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-amber-300 uppercase flex items-center gap-1.5">
              <span>⚠️ Pending Moderation Queue ({pendingListings.length})</span>
            </h3>
            <span className="text-xs text-amber-400">Student submissions awaiting review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingListings.map(item => (
              <div key={item.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      {item.price > 0 ? `₹${item.price}` : 'FREE / Donate'}
                    </span>
                    <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 mb-1">📍 {item.location}</p>
                  <p className="text-xs text-slate-400 mb-2">💬 WA: {item.whatsapp}</p>
                  {item.desc && (
                    <p className="text-xs text-slate-300 bg-slate-800 p-2 rounded mb-3">
                      {item.desc}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onUpdateStatus(item.id, 'approved')}
                    className="btn-3d btn-primary btn-sm flex-1 text-xs py-1.5 flex items-center justify-center gap-1 bg-emerald-600 cursor-pointer"
                  >
                    <Check size={13} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(item.id, 'rejected')}
                    className="btn-3d btn-danger btn-sm flex-1 text-xs py-1.5 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X size={13} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Marketplace Listings */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700">
          <div>
            <h3 className="text-base font-black text-white">
              All Marketplace Items ({filteredItems.length})
            </h3>
            <p className="text-xs text-slate-400">Manage student advertisements, mark sold, edit or delete listings.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none w-44"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white outline-none"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved Live</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-700/80">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">WhatsApp</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 bg-slate-900/30">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No marketplace items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-700/30">
                    <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 capitalize text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">
                      {item.price > 0 ? `₹${item.price}` : 'Free'}
                    </td>
                    <td className="py-3 px-3 text-slate-300 truncate max-w-[120px]">
                      {item.location}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <a
                        href={`https://wa.me/${item.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-400 flex items-center gap-1"
                      >
                        <span>{item.whatsapp}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'approved'
                          ? 'bg-emerald-600/20 text-emerald-400'
                          : item.status === 'pending'
                          ? 'bg-amber-600/20 text-amber-400'
                          : item.status === 'sold'
                          ? 'bg-purple-600/20 text-purple-400'
                          : 'bg-rose-600/20 text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {item.status !== 'sold' && (
                        <button
                          onClick={() => onUpdateStatus(item.id, 'sold')}
                          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold text-amber-300 cursor-pointer"
                        >
                          Mark Sold
                        </button>
                      )}
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete listing "${item.title}"?`)) {
                            onDeleteListing(item.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Listing Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4">
            <h3 className="text-base font-black text-white">Edit Marketplace Listing</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                  >
                    <option value="books">Books</option>
                    <option value="gadgets">Gadgets</option>
                    <option value="rooms">Rooms</option>
                    <option value="services">Services</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={editingItem.location}
                  onChange={e => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">WhatsApp</label>
                <input
                  type="text"
                  required
                  value={editingItem.whatsapp}
                  onChange={e => setEditingItem({ ...editingItem, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.desc}
                  onChange={e => setEditingItem({ ...editingItem, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-3d btn-primary btn-sm text-xs font-bold py-1.5 px-4 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
