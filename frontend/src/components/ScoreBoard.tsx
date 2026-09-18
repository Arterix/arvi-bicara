'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export const ScoreBoard: React.FC = () => {
  const { totalStars } = useAppStore();

  return (
    <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border-2 border-indigo-100">
      {/* Stars Badge */}
      <motion.div
        key={totalStars}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-1.5"
      >
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <span className="text-base font-black text-slate-800">{totalStars}</span>
        <span className="text-xs font-bold text-slate-500">Bintang</span>
      </motion.div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Level / Status */}
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-black text-indigo-900">
          {totalStars >= 50
            ? 'Master English 👑'
            : totalStars >= 20
            ? 'Super Speaker ⭐'
            : 'Pemberani 🚀'}
        </span>
      </div>
    </div>
  );
};
