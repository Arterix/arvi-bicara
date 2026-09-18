'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  level?: number;
  isActive: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  level = 0,
  isActive,
  barCount = 12,
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-slate-900/10 rounded-full backdrop-blur-xs">
      {bars.map((barIndex) => {
        // Vary height based on index and overall audio level
        const factor = Math.sin((barIndex / barCount) * Math.PI);
        const dynamicHeight = isActive ? Math.max(6, (level / 100) * 32 * factor + 4) : 4;

        return (
          <motion.div
            key={barIndex}
            animate={{
              height: `${dynamicHeight}px`,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
            className={`w-1 rounded-full transition-colors duration-200 ${
              isActive
                ? 'bg-gradient-to-t from-teal-400 to-cyan-300 shadow-[0_0_6px_#67e8f9]'
                : 'bg-slate-300'
            }`}
          />
        );
      })}
    </div>
  );
};
