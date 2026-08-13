import React from 'react';
import { COMPANY_INFO } from '../data/copyData';
import { ArrowRight, MessageSquare, Phone, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';

interface UrgencyCtaProps {
  onOpenLeadModal: () => void;
}

export const UrgencyCta: React.FC<UrgencyCtaProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative border-t border-slate-800 overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Warning pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Don't Leave Your Success to Chance</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Every year, thousands of students miss their dream admission because of poor preparation.
        </h2>

        {/* Copy text */}
        <p className="text-lg md:text-xl font-bold text-amber-400 max-w-3xl mx-auto">
          Don't let that be your story. Join hundreds of successful students who have trusted Brainiac Educonsult to help them achieve academic excellence.
        </p>

        {/* Seats counter alert */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 max-w-xl mx-auto backdrop-blur-md flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-extrabold text-amber-200">
            Seats are limited. Register now before the next batch fills up!
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenLeadModal}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base shadow-2xl shadow-amber-500/25 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Enroll Now & Secure Slot</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted, "Hello Brainiac Educonsult, I want to secure a slot in the next tutorial batch. Please send me registration details!")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold text-base border border-emerald-700/60 flex items-center justify-center gap-2.5 transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span>WhatsApp: {COMPANY_INFO.primaryPhone}</span>
          </a>
        </div>

        {/* Direct Contact Numbers & Slogan */}
        <div className="pt-8 border-t border-slate-800/80 max-w-2xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-300">
            <a href={getPhoneCallLink(COMPANY_INFO.primaryPhone)} className="hover:text-amber-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {COMPANY_INFO.primaryPhone}</span>
            </a>
            <a href={getPhoneCallLink(COMPANY_INFO.secondaryPhone)} className="hover:text-amber-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {COMPANY_INFO.secondaryPhone}</span>
            </a>
          </div>

          <p className="text-xs text-amber-400/90 font-semibold uppercase tracking-widest pt-2">
            Physical & Online Classes Available
          </p>

          <div className="text-sm font-extrabold text-white tracking-wide pt-1">
            {COMPANY_INFO.name} — <span className="text-slate-400 font-normal">{COMPANY_INFO.slogan}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
