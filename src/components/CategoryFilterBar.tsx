import React from 'react';
import { PostCategory } from '../types';
import { Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

interface CategoryFilterBarProps {
  selectedCategory: 'All' | PostCategory;
  onSelectCategory: (category: 'All' | PostCategory) => void;
  counts: Record<string, number>;
  isSavedFilterActive?: boolean;
  onToggleSavedFilter?: () => void;
  savedCount?: number;
  selectedQualification?: string;
  onSelectQualification?: (qual: string) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
  isSavedFilterActive = false,
  onToggleSavedFilter,
  savedCount = 0,
  selectedQualification = 'all',
  onSelectQualification
}) => {
  const categories: Array<{ label: string; value: 'All' | PostCategory; icon: string }> = [
    { label: 'All Updates', value: 'All', icon: '🏛️' },
    { label: 'Jobs', value: 'Jobs', icon: '💼' },
    { label: 'Notices & Results', value: 'Notices', icon: '📢' },
    { label: 'Scholarships', value: 'Scholarships', icon: '🎓' },
    { label: 'Sarkari Yojna', value: 'Sarkari Yojna', icon: '🇮🇳' }
  ];

  const qualifications = [
    { id: 'all', label: 'All Qualifications' },
    { id: '10+2', label: '10+2 / Inter' },
    { id: 'Graduate', label: 'Graduation' },
    { id: '10th', label: '10th Pass' }
  ];

  return (
    <div id="category-filter-bar" className="my-6 space-y-3">
      {/* Primary Category Buttons */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-center items-center">
        {categories.map((cat) => {
          const isActive = !isSavedFilterActive && selectedCategory === cat.value;
          const count = cat.value === 'All' ? counts['All'] || 0 : counts[cat.value] || 0;
          return (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              key={cat.value}
              id={`filter-btn-${cat.value.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                if (isSavedFilterActive && onToggleSavedFilter) {
                  onToggleSavedFilter();
                }
                onSelectCategory(cat.value);
              }}
              className={`btn-3d py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#0056b3] text-white ring-2 ring-blue-300 shadow-md'
                  : 'bg-slate-700 hover:bg-slate-800 text-white'
              }`}
              style={{
                boxShadow: isActive ? '0 4px 0 #003773' : '0 4px 0 #1e293b'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                isActive ? 'bg-white/20 text-white' : 'bg-black/25 text-slate-200'
              }`}>
                {count}
              </span>
            </motion.button>
          );
        })}

        {/* Saved Posts Filter Tab */}
        {onToggleSavedFilter && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="filter-btn-saved"
            onClick={onToggleSavedFilter}
            className={`btn-3d py-2 px-3.5 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isSavedFilterActive
                ? 'bg-amber-600 text-white ring-2 ring-amber-300 shadow-md'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
            style={{
              boxShadow: isSavedFilterActive ? '0 4px 0 #b45309' : '0 4px 0 #fde68a'
            }}
          >
            <Bookmark size={14} className={isSavedFilterActive ? 'fill-white' : 'fill-amber-700 text-amber-700'} />
            <span>Saved ({savedCount})</span>
          </motion.button>
        )}
      </div>

      {/* Secondary Qualification Chips Filter */}
      {onSelectQualification && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mr-1">
            Filter by Eligibility:
          </span>
          {qualifications.map(q => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              key={q.id}
              onClick={() => onSelectQualification(q.id)}
              className={`px-3 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer border ${
                selectedQualification === q.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {q.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
