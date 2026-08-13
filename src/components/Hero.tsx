import React from 'react';
import { COMPANY_INFO } from '../data/copyData';
import { Sparkles, ArrowRight, MessageSquare, Phone, CheckCircle, Star, Users, Award, ShieldCheck } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';

interface HeroProps {
  onOpenLeadModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 md:py-24 border-b border-slate-800">
      {/* Background Graphic overlay */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-luminosity">
        <img
          src="/src/assets/images/brainiac_hero_bg_1786049388089.jpg"
          alt="Brainiac Academic Environment"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Radiant glow spots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Premier Examination & Tutorial Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
              Unlock Your Academic Potential with{' '}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Brainiac Educonsult
              </span>
            </h1>

            {/* Exam Coverage Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span className="text-xs text-slate-400 font-medium">Helping Students Excel in:</span>
              {['WAEC', 'NECO', 'JAMB', 'IGCSE', 'JUPEB', 'A-Level'].map((exam) => (
                <span
                  key={exam}
                  className="px-2.5 py-0.5 rounded-md bg-slate-800/90 text-amber-300 border border-amber-500/30 text-xs font-bold"
                >
                  {exam}
                </span>
              ))}
            </div>

            {/* Sub-headline Statement */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-sm shadow-xl">
              <p className="text-lg md:text-xl font-bold text-amber-400 flex items-center justify-center lg:justify-start gap-2">
                <span>Stop Struggling. Start Excelling.</span>
              </p>
              <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
                {COMPANY_INFO.heroDescription}
              </p>
            </div>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
              {COMPANY_INFO.commitmentText}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onOpenLeadModal}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Enroll Today & Secure Slot</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted, "Hello Brainiac Educonsult! I want to enroll for tutorial classes. Please guide me!")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold text-base border border-emerald-700/60 flex items-center justify-center gap-3 transition-colors shadow-lg"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>WhatsApp: {COMPANY_INFO.primaryPhone}</span>
              </a>
            </div>

            {/* Micro Trust Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Physical & Online Classes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Small Class Sizes</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Top Score Track Record</span>
              </div>
            </div>

          </div>

          {/* Visual Hero Card / Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl p-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="/src/assets/images/brainiac_student_success_1786049404327.jpg"
                  alt="Brainiac Educonsult Student Success"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Floating Achievement Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-white shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Proven Excellence</p>
                      <p className="text-sm font-bold text-white mt-0.5">Building Brighter Minds, Creating Better Futures.</p>
                    </div>
                    <div className="flex -space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Call Hotline Banner */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">Need Urgent Assistance?</span>
                    <span className="text-xs font-bold text-white">{COMPANY_INFO.primaryPhone} | {COMPANY_INFO.secondaryPhone}</span>
                  </div>
                </div>
                <button
                  onClick={onOpenLeadModal}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
