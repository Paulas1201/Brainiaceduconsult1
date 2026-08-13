import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/copyData';
import { Phone, MessageSquare, GraduationCap, Menu, X, ArrowRight } from 'lucide-react';
import { getWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';

interface NavbarProps {
  onOpenLeadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLeadModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                {COMPANY_INFO.name}
              </span>
              <span className="block text-[11px] font-medium text-amber-400/90 tracking-wider uppercase">
                Tutorial & Prep Center
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#why-us" className="hover:text-amber-400 transition-colors">Why Choose Us</a>
            <a href="#modes" className="hover:text-amber-400 transition-colors">Learning Modes</a>
            <a href="#exams" className="hover:text-amber-400 transition-colors">Exam Prep</a>
            <a href="#subjects" className="hover:text-amber-400 transition-colors">Subjects</a>
            <a href="#reviews" className="hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#who-can-enroll" className="hover:text-amber-400 transition-colors">Target Students</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Direct Call Button */}
            <a
              href={getPhoneCallLink(COMPANY_INFO.primaryPhone)}
              className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/60 transition-colors"
              title="Call Brainiac Hotline"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{COMPANY_INFO.primaryPhone}</span>
            </a>

            {/* Direct WhatsApp Button */}
            <a
              href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-800/50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            {/* Primary Enroll CTA */}
            <button
              onClick={onOpenLeadModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Enroll Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenLeadModal}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Enroll
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 font-medium text-slate-300 text-sm">
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Why Choose Us
            </a>
            <a
              href="#modes"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Learning Modes
            </a>
            <a
              href="#exams"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Exam Prep
            </a>
            <a
              href="#subjects"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Subjects Offered
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-amber-400 py-1"
            >
              Student Reviews
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <a
              href={getPhoneCallLink(COMPANY_INFO.primaryPhone)}
              className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Hotline: {COMPANY_INFO.primaryPhone}</span>
            </a>

            <a
              href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-emerald-900/60 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Us Direct ({COMPANY_INFO.primaryPhone})</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadModal();
              }}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 mt-2 shadow-lg shadow-amber-500/20"
            >
              <span>Enroll Today</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
