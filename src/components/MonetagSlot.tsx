import React from 'react';
import { motion } from 'motion/react';

interface MonetagSlotProps {
  monetagEnabled?: boolean;
}

export const MonetagSlot: React.FC<MonetagSlotProps> = ({ monetagEnabled = true }) => {
  if (!monetagEnabled) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 text-center overflow-hidden shadow-xs"
    >
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Sponsored Advertisement</div>
      <div id="monetag-container" className="min-h-[50px] flex items-center justify-center">
        {/* Ad container slot */}
      </div>
    </motion.div>
  );
};
