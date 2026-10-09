import React, { useState } from 'react';
import { PlusCircle, MapPin, MessageCircle, X, Check, ShoppingBag, BookOpen, Smartphone, Home, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketplaceItem, MarketCategory } from '../types';

interface MarketplaceSectionProps {
  items: MarketplaceItem[];
  onSubmitAd: (data: Omit<MarketplaceItem, 'id' | 'status' | 'createdAt'>) => Promise<void>;
}

export const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({
  items,
  onSubmitAd
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | MarketCategory>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketCategory>('books');
  const [price, setPrice] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [desc, setDesc] = useState('');

  const filterTabs: Array<{ id: 'all' | MarketCategory; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Items', icon: <ShoppingBag size={14} /> },
    { id: 'books', label: 'Books & Notes', icon: <BookOpen size={14} /> },
    { id: 'gadgets', label: 'Phones & Gadgets', icon: <Smartphone size={14} /> },
    { id: 'rooms', label: 'Room & PG', icon: <Home size={14} /> },
    { id: 'services', label: 'Micro Services', icon: <Wrench size={14} /> },
  ];

  const approvedItems = items.filter(i => i.status === 'approved');
  const filteredItems = selectedFilter === 'all'
    ? approvedItems
    : approvedItems.filter(i => i.category === selectedFilter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || price === '' || !location || !whatsapp) return;
    setIsSubmitting(true);
    try {
      await onSubmitAd({
        title,
        category,
        price: Number(price),
        location,
        whatsapp: whatsapp.replace(/\D/g, ''),
        desc
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setTitle('');
        setPrice('');
        setLocation('');
        setWhatsapp('');
        setDesc('');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit listing. Please check connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="marketplace" className="my-16 max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-white to-blue-50/40 rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm mb-8 text-center relative overflow-hidden"
      >
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          Student Utility Hub
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          🎓 Student Marketplace
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-6">
          Buy, sell old competitive books, calculators, gadgets, student rooms or offer micro-services directly via WhatsApp.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-3d btn-primary py-3 px-6 text-sm font-bold shadow-md cursor-pointer"
        >
          <PlusCircle size={17} />
          <span>Post Free Student Listing</span>
        </motion.button>
      </motion.div>

      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {filterTabs.map(tab => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#0056b3] text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-[#0056b3] hover:text-[#0056b3]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Marketplace Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-md mx-auto">
          <p className="text-sm text-slate-500 mb-3">No active listings in this category yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-3d btn-primary btn-sm text-xs cursor-pointer"
          >
            Be the first to post!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, idx) => {
            const priceTag = item.price > 0 ? `₹${item.price}` : 'FREE / Donate';
            const waMessage = encodeURIComponent(
              `Hi! I saw your "${item.title}" listed on Nikhil Talks Marketplace and want to inquire.`
            );
            const waUrl = `https://wa.me/${item.whatsapp}?text=${waMessage}`;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.3) }}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-black text-emerald-600">
                      {priceTag}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-3 font-medium">
                    <MapPin size={13} className="text-[#0056b3] shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  {item.desc && (
                    <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {item.desc}
                    </p>
                  )}
                </div>

                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-3d btn-wa w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={15} />
                  <span>Contact Seller on WA</span>
                </motion.a>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Post Free Listing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={20} />
              </button>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Ad Submitted Successfully!
                  </h3>
                  <p className="text-sm text-slate-600">
                    Aapka listing review ke liye submit ho gaya hai! Nikhil Talks admin approval ke baad live show hoga.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Post Free Student Ad
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    100% Free listing for books, study gadgets, room rent, and notes.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Item / Service Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. NCERT Class 11-12 Set / Scientific Calculator"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value as MarketCategory)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none"
                        >
                          <option value="books">Books & Notes</option>
                          <option value="gadgets">Phones & Gadgets</option>
                          <option value="rooms">Room & PG</option>
                          <option value="services">Micro Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Price (₹) [0 for Free] *
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={price}
                          onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="e.g. 250"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          City / Area Location *
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          placeholder="e.g. Patna / Kankarbagh"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={e => setWhatsapp(e.target.value)}
                          placeholder="e.g. 919876543210"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Item Description / Details
                      </label>
                      <textarea
                        rows={3}
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Condition, edition, study material details..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:bg-white focus:border-[#0056b3] outline-none resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-3d btn-primary w-full py-3 text-sm font-bold mt-2 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Listing For Free"}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
