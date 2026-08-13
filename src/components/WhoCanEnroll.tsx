import React from 'react';
import { WHO_CAN_ENROLL } from '../data/copyData';
import { School, FileText, Target, Globe, GraduationCap, Award, Sparkles, ArrowRight } from 'lucide-react';

interface WhoCanEnrollProps {
  onOpenLeadModal: () => void;
}

export const WhoCanEnroll: React.FC<WhoCanEnrollProps> = ({ onOpenLeadModal }) => {
  const getEnrollIcon = (iconName: string) => {
    switch (iconName) {
      case 'School':
        return <School className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-amber-400" />;
      case 'Target':
        return <Target className="w-5 h-5 text-amber-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      default:
        return <GraduationCap className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="who-can-enroll" className="py-20 bg-slate-900 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Open Registrations
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Who Can Enroll?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Our programs are designed specifically for students across various secondary and pre-university levels.
          </p>
        </div>

        {/* Categories Chips Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {WHO_CAN_ENROLL.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-4 group shadow-md"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform shrink-0">
                {getEnrollIcon(item.icon)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{item.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenLeadModal}
            className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Register Now For Your Category</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
