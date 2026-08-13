import React, { useState } from 'react';
import { SUBJECTS_LIST } from '../data/copyData';
import { SubjectItem } from '../types';
import {
  Calculator,
  BookOpen,
  Zap,
  FlaskConical,
  Dna,
  TrendingUp,
  Landmark,
  Feather,
  Receipt,
  ShoppingBag,
  BookMarked,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SubjectsGridProps {
  onOpenLeadModal: () => void;
}

export const SubjectsGrid: React.FC<SubjectsGridProps> = ({ onOpenLeadModal }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);

  const categories = ['All', 'Sciences', 'Commercial', 'Arts & General'];

  const filteredSubjects =
    activeCategory === 'All'
      ? SUBJECTS_LIST
      : SUBJECTS_LIST.filter((s) => s.category === activeCategory);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-amber-400" />;
      case 'Dna':
        return <Dna className="w-5 h-5 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-amber-400" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-amber-400" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-amber-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'BookMarked':
        return <BookMarked className="w-5 h-5 text-amber-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="subjects" className="py-20 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            All Key Subjects
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Subjects We Offer
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            From foundational calculations to complex essay writing, our subject tutors simplify concepts for maximum retention.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {getSubjectIcon(sub.iconName)}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-[11px] font-semibold text-amber-300 border border-slate-800">
                    {sub.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{sub.name}</h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {sub.description}
                </p>

                {/* Key Topics List */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Key Topic Highlights:</span>
                  {sub.keyTopics.map((topic, tIdx) => (
                    <div key={tIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenLeadModal}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs border border-slate-700/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Enroll for {sub.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
