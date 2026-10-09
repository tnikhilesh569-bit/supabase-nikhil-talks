import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface FloatingWhatsAppProps {
  url: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ url }) => {
  return (
    <aside aria-label="Floating WhatsApp CTA">
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        id="floating-wa"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 btn-3d btn-wa py-3 px-5 rounded-full shadow-2xl pulse-animation flex items-center gap-2 font-black text-sm tracking-wide"
        aria-label="Join WhatsApp Channel"
      >
        <MessageCircle size={20} className="fill-white text-transparent" />
        <span className="hidden sm:inline">Join WhatsApp</span>
      </motion.a>
    </aside>
  );
};
