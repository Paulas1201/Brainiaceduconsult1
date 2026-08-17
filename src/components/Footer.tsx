import React from 'react';
import { COMPANY_INFO } from '../data/copyData';
import { GraduationCap, Phone, MessageSquare, ShieldCheck, Clock, MapPin, Lock } from 'lucide-react';
import { getWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';

interface FooterProps {
  onOpenLeadModal: () => void;
  onOpenAdminPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLeadModal,
  onOpenAdminPortal,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative flex items-center justify-center">
                <img
                  src={COMPANY_INFO.logoUrl}
                  alt={COMPANY_INFO.name}
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = COMPANY_INFO.logoDirectUrl;
                  }}
                />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block">
                  {COMPANY_INFO.name}
                </span>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Tutorial &amp; Prep Center
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              {COMPANY_INFO.slogan}
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Registered & Certified Tutorial Center</span>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact & Hotline</h4>
            
            <div className="space-y-2 text-xs">
              <a
                href={getPhoneCallLink(COMPANY_INFO.primaryPhone)}
                className="hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Hotline: {COMPANY_INFO.primaryPhone}</span>
              </a>

              <a
                href={getPhoneCallLink(COMPANY_INFO.secondaryPhone)}
                className="hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Line 2: {COMPANY_INFO.secondaryPhone}</span>
              </a>

              <a
                href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: {COMPANY_INFO.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Programs & Exams</h4>
            
            <ul className="space-y-1.5 text-xs">
              <li><a href="#exams" className="hover:text-amber-400">WAEC & NECO Classes</a></li>
              <li><a href="#exams" className="hover:text-amber-400">JAMB UTME CBT Prep</a></li>
              <li><a href="#exams" className="hover:text-amber-400">IGCSE Cambridge Tuition</a></li>
              <li><a href="#exams" className="hover:text-amber-400">JUPEB Direct Entry</a></li>
              <li><a href="#exams" className="hover:text-amber-400">A-Level Programs</a></li>
            </ul>
          </div>

          {/* Admissions & Office Schedule */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Admissions & Hours</h4>
            
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-200">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  <p className="text-[11px] text-slate-400">Sunday Online Support: 1:00 PM - 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-medium">Physical Centers & Online Portal</p>
                  <p className="text-[11px] text-slate-400">Nigeria & Cambridge International Prep</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenLeadModal}
                className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors cursor-pointer"
              >
                Register For Upcoming Batch
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#why-us" className="hover:text-slate-300">Why Us</a>
            <a href="#modes" className="hover:text-slate-300">Learning Modes</a>
            <button onClick={onOpenLeadModal} className="text-amber-400 hover:underline cursor-pointer">Enroll Now</button>
            
            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="text-slate-600 hover:text-slate-400 flex items-center gap-1 text-[11px] transition-colors cursor-pointer ml-2"
                title="Staff Portal Login"
              >
                <Lock className="w-3 h-3" />
                <span>Staff Portal</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
