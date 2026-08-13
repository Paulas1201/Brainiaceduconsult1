import React from 'react';
import { GAINS_LIST } from '../data/copyData';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface WhatYouGainProps {
  onOpenLeadModal: () => void;
}

export const WhatYouGain: React.FC<WhatYouGainProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="py-20 bg-slate-900 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Header */}
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Student Transformation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              What You'll Gain at Brainiac Educonsult
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Our holistic methodology ensures that students don't just memorize past questions—they master principles and build lifelong academic resilience.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenLeadModal}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Start Gaining Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Checklist Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GAINS_LIST.map((gain, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-start gap-3.5 shadow-md"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 leading-snug">
                    {gain}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
