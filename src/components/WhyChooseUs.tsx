import React from 'react';
import { WHY_CHOOSE_US } from '../data/copyData';
import { GraduationCap, BrainCircuit, Sliders, Award, UserCheck, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-amber-400" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-6 h-6 text-amber-400" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-amber-400" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-400" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-amber-400" />;
      default:
        return <GraduationCap className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Unmatched Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Why Choose Brainiac Educonsult?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            We go beyond standard teaching to deliver structured mentorship, exam techniques, and confidence building for every student.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getIcon(item.icon)}
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[11px] font-semibold text-slate-300">
                  {item.highlight}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Brainiac Guaranteed Quality</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
