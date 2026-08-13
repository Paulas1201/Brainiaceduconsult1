import React from 'react';
import { LEARNING_MODES } from '../data/copyData';
import { Building2, Video, PlayCircle, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface LearningModesProps {
  onOpenLeadModal: () => void;
}

export const LearningModes: React.FC<LearningModesProps> = ({ onOpenLeadModal }) => {
  const getModeIcon = (id: string) => {
    switch (id) {
      case 'physical':
        return <Building2 className="w-6 h-6 text-amber-400" />;
      case 'online':
        return <Video className="w-6 h-6 text-amber-400" />;
      case 'recorded':
        return <PlayCircle className="w-6 h-6 text-amber-400" />;
      case 'oneonone':
        return <UserCheck className="w-6 h-6 text-amber-400" />;
      default:
        return <Building2 className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="modes" className="py-20 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Tailored To Your Schedule
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Flexible Learning Options
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Choose the learning style that best matches your lifestyle, location, and study preferences.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {LEARNING_MODES.map((mode) => (
            <div
              key={mode.id}
              className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {getModeIcon(mode.id)}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    {mode.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {mode.description}
                </p>

                {/* Features list */}
                <div className="space-y-2.5 mb-8">
                  {mode.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onOpenLeadModal}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Enroll in {mode.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
