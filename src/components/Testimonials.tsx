import React from 'react';
import { PARENTS_LOVE, TESTIMONIALS } from '../data/copyData';
import { CheckCircle2, Heart, Quote, Star, Users } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Trusted By Hundreds
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What Parents and Students Love About Us
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Real feedback from candidates and guardians who experienced our academic system firsthand.
          </p>
        </div>

        {/* 6 Key Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARENTS_LOVE.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all flex items-start gap-4 shadow-lg"
            >
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Quote Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800/80">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 relative flex flex-col justify-between shadow-xl"
            >
              <div>
                <Quote className="w-8 h-8 text-amber-500/30 mb-4" />
                <p className="text-slate-200 text-sm italic leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-base font-bold text-white">{t.name}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-0.5">
                  <span>{t.role}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-[10px]">
                    {t.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
