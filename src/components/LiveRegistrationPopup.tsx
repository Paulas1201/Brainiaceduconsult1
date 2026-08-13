import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, Sparkles, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { Lead } from '../types';

interface LiveRegistrationPopupProps {
  onOpenLeadModal: () => void;
}

interface RegistrationItem {
  id: string;
  name: string;
  location: string;
  exam: string;
  mode: string;
  subjects?: string;
  timeAgo: string;
}

const DEFAULT_RECENT_REGISTRATIONS: RegistrationItem[] = [
  {
    id: 'reg-1',
    name: 'Chinedu O.',
    location: 'Ikeja, Lagos',
    exam: 'WAEC & NECO',
    mode: 'Physical Classes',
    subjects: 'Maths, Physics & Chemistry',
    timeAgo: 'Just now',
  },
  {
    id: 'reg-2',
    name: 'Amina B.',
    location: 'Gwarinpa, Abuja',
    exam: 'JAMB / UTME',
    mode: 'Live Online Classes',
    subjects: 'English, Biology & Chemistry',
    timeAgo: '1 min ago',
  },
  {
    id: 'reg-3',
    name: 'Tunde A.',
    location: 'Lekki Phase 1, Lagos',
    exam: 'IGCSE Cambridge',
    mode: 'One-on-One Private Tutor',
    subjects: 'Mathematics & Extended Sciences',
    timeAgo: '2 mins ago',
  },
  {
    id: 'reg-4',
    name: 'Blessing E.',
    location: 'Bodija, Ibadan',
    exam: 'WAEC Special Prep',
    mode: 'Physical Classes',
    subjects: 'Financial Accounting & Commerce',
    timeAgo: 'Just now',
  },
  {
    id: 'reg-5',
    name: 'David K.',
    location: 'GRA, Port Harcourt',
    exam: 'JAMB 300+ Target',
    mode: 'Live Online Classes',
    subjects: 'Use of English, Physics, Chem, Bio',
    timeAgo: '3 mins ago',
  },
  {
    id: 'reg-6',
    name: 'Fatima M.',
    location: 'Maitama, Abuja',
    exam: 'JUPEB 200-Level Direct Entry',
    mode: 'Physical Classes',
    subjects: 'Physics, Chemistry & Biology',
    timeAgo: 'Just now',
  },
  {
    id: 'reg-7',
    name: 'Kehinde & Taiwo A.',
    location: 'Yaba, Lagos',
    exam: 'WAEC & JAMB Combined',
    mode: 'Weekend Intensive Classes',
    subjects: 'General Science Subjects',
    timeAgo: '1 min ago',
  },
  {
    id: 'reg-8',
    name: 'Emeka U.',
    location: 'Independence Layout, Enugu',
    exam: 'A-Level Cambridge Prep',
    mode: 'Live Online Classes',
    subjects: 'Pure Maths & Mechanics',
    timeAgo: '4 mins ago',
  },
  {
    id: 'reg-9',
    name: 'Zainab S.',
    location: 'Victoria Island, Lagos',
    exam: 'IGCSE & Checkpoint',
    mode: 'One-on-One Home Tutor',
    subjects: 'English Language & Literature',
    timeAgo: 'Just now',
  },
];

export const LiveRegistrationPopup: React.FC<LiveRegistrationPopupProps> = ({ onOpenLeadModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>(DEFAULT_RECENT_REGISTRATIONS);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch real submitted leads to prepend to notification pool if available
  useEffect(() => {
    const fetchRealLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (Array.isArray(data.leads) && data.leads.length > 0) {
          const formatted: RegistrationItem[] = data.leads.map((l: Lead) => {
            // Mask student name for privacy: "John Doe" -> "John D."
            const nameParts = l.name.trim().split(' ');
            const maskedName =
              nameParts.length > 1
                ? `${nameParts[0]} ${nameParts[1].charAt(0).toUpperCase()}.`
                : l.name;

            return {
              id: l.id,
              name: maskedName,
              location: 'Nigeria (Live Enrollment)',
              exam: l.examType || 'WAEC / JAMB',
              mode: l.learningMode || 'Physical / Online',
              subjects: l.subjects?.slice(0, 3).join(', ') || undefined,
              timeAgo: 'Just now',
            };
          });

          // Merge unique real leads at the beginning of the pool
          setRegistrations([...formatted, ...DEFAULT_RECENT_REGISTRATIONS]);
        }
      } catch {
        // Fallback gracefully to default curated pool
      }
    };

    fetchRealLeads();
  }, []);

  const showNotification = useCallback(() => {
    if (isPaused) return;

    setCurrentIndex((prev) => (prev + 1) % registrations.length);
    setIsVisible(true);

    // Keep visible for 7.5 seconds, then hide
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 7500);
  }, [isPaused, registrations.length]);

  useEffect(() => {
    // Initial popup after 6 seconds of browsing
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 6000);

    // Repeat popup every 1 minute (60,000 ms)
    timerRef.current = setInterval(() => {
      showNotification();
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showNotification]);

  const currentItem = registrations[currentIndex] || registrations[0];

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const handleCardClick = () => {
    setIsVisible(false);
    onOpenLeadModal();
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md pointer-events-none">
      <AnimatePresence>
        {isVisible && currentItem && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleCardClick}
            className="pointer-events-auto group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-900/95 p-3.5 sm:p-4 text-left shadow-2xl shadow-black/80 backdrop-blur-xl border border-amber-500/30 hover:border-amber-400 transition-all"
            role="alert"
            aria-live="polite"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3">
              
              {/* Student Avatar with Pulse */}
              <div className="relative shrink-0 mt-0.5">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 font-black text-sm">
                  {currentItem.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </span>
              </div>

              {/* Information Body */}
              <div className="flex-1 min-w-0 pr-4">
                
                {/* Header tag */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>New Enrollment</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {currentItem.timeAgo}
                  </span>
                </div>

                {/* Candidate & Location */}
                <div className="mt-1">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {currentItem.name}
                  </span>
                  <span className="text-slate-300 text-xs ml-1">
                    registered for
                  </span>
                  <span className="font-extrabold text-amber-300 text-xs ml-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {currentItem.exam}
                  </span>
                </div>

                {/* Mode & Location Details */}
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 truncate">
                  <span className="flex items-center gap-1 text-slate-300">
                    <UserCheck className="w-3 h-3 text-amber-400" />
                    <span className="truncate">{currentItem.mode}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate text-slate-400">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{currentItem.location}</span>
                  </span>
                </div>

                {/* Subjects if present */}
                {currentItem.subjects && (
                  <p className="mt-1 text-[10px] text-slate-400 truncate italic">
                    Focus: {currentItem.subjects}
                  </p>
                )}

                {/* Action CTA Prompt */}
                <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                  <Sparkles className="w-3 h-3" />
                  <span>Reserve your slot for next batch</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>

              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                title="Dismiss notification"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Subtle Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 7.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-emerald-400 origin-left"
            />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
