'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GradeLevel } from '@/types';
import { GraduationCap } from 'lucide-react';

export const GradeSelector: React.FC = () => {
  const { gradeLevel, setGradeLevel } = useAppStore();

  const options: Array<{ id: GradeLevel; label: string; sub: string }> = [
    { id: 'paud', label: 'PAUD / TK', sub: 'Usia 4-6 Th' },
    { id: 'sd_low', label: 'SD Kelas 1-3', sub: 'Usia 6-9 Th' },
    { id: 'sd_high', label: 'SD Kelas 4-6', sub: 'Usia 9-12 Th' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-indigo-950/10 rounded-2xl backdrop-blur-xs">
      {options.map((opt) => {
        const isSelected = gradeLevel === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setGradeLevel(opt.id)}
            className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              isSelected
                ? 'bg-white text-indigo-900 shadow-md scale-102 border border-indigo-100'
                : 'text-slate-600 hover:text-indigo-900 hover:bg-white/50'
            }`}
          >
            <span>{opt.label}</span>
            <span className="text-[10px] font-normal opacity-75">{opt.sub}</span>
          </button>
        );
      })}
    </div>
  );
};
