import React, { useState } from 'react';
import { COMPANY_INFO, SUBJECTS_LIST } from '../data/copyData';
import { Lead } from '../types';
import {
  X,
  Send,
  MessageSquare,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { generateCustomWhatsAppMessage, getWhatsAppLink } from '../utils/whatsapp';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted?: (lead: Lead) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onLeadSubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [examType, setExamType] = useState('WAEC');
  const [learningMode, setLearningMode] = useState('Physical Classes');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'English Language']);
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [whatsappMsgText, setWhatsappMsgText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleSubject = (subjName: string) => {
    if (selectedSubjects.includes(subjName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !whatsapp.trim()) {
      alert('Please fill in your Name, Email, and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    const leadPayload = {
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      examType,
      learningMode,
      subjects: selectedSubjects,
      notes: notes.trim(),
      customGsheetUrl: typeof window !== 'undefined' ? localStorage.getItem('brainiac_gsheet_url') || '' : '',
    };

    const customMsg = generateCustomWhatsAppMessage(leadPayload);
    setWhatsappMsgText(customMsg);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });

      const data = await response.json();

      if (data.success && data.lead) {
        setSubmittedLead(data.lead);
        if (onLeadSubmitted) onLeadSubmitted(data.lead);
      }
    } catch (err) {
      console.error('Local API submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Auto trigger WhatsApp window
      const waUrl = getWhatsAppLink(COMPANY_INFO.whatsappFormatted, customMsg);
      window.open(waUrl, '_blank');
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(whatsappMsgText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setName('');
    setEmail('');
    setWhatsapp('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Enrollment Lead Capture</h3>
              <p className="text-xs text-amber-400">Brainiac Educonsult Academic Portal</p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 md:p-8 space-y-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Fill in your details below to reserve your slot. Upon submission, a customized WhatsApp message will be generated for quick 1-click confirmation!
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chidiebere Adebayo"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email & WhatsApp Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="e.g. 08131055940"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Exam & Learning Mode Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exam Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Target Exam / Program
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="WAEC">WAEC Examination</option>
                    <option value="NECO">NECO Examination</option>
                    <option value="JAMB">JAMB UTME</option>
                    <option value="IGCSE">IGCSE Cambridge</option>
                    <option value="JUPEB">JUPEB Direct Entry</option>
                    <option value="A-Level">A-Level Qualifications</option>
                    <option value="General Academic Support">General Academic Support</option>
                  </select>
                </div>

                {/* Learning Mode */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Preferred Learning Style
                  </label>
                  <select
                    value={learningMode}
                    onChange={(e) => setLearningMode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Physical Classes">Physical Classes</option>
                    <option value="Live Online Classes">Live Online Classes</option>
                    <option value="Recorded Lessons">Recorded Lessons</option>
                    <option value="One-on-One Coaching">One-on-One Coaching</option>
                  </select>
                </div>
              </div>

              {/* Subjects Multi Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Select Subjects Needed (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {SUBJECTS_LIST.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.name);
                    return (
                      <button
                        type="button"
                        key={subj.id}
                        onClick={() => toggleSubject(subj.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{subj.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Additional Notes / Specific Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Preferred timing, weak topics, or target scores..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder-slate-500 text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Lead...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Form & Launch WhatsApp</span>
                  </>
                )}
              </button>

            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-white">Enrollment Request Received!</h4>
                <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                  Your lead details have been logged. Click below to chat directly with the Brainiac Educonsult admissions counselor on WhatsApp.
                </p>
              </div>

              {/* Lead Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 text-slate-300 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Candidate Name:</span>
                  <span className="font-bold text-white">{name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">WhatsApp:</span>
                  <span className="font-bold text-amber-400">{whatsapp}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Target Exam:</span>
                  <span className="font-bold text-white">{examType} ({learningMode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Slot Reserved & Active</span>
                  </span>
                </div>
              </div>

              {/* WhatsApp Action Buttons */}
              <div className="space-y-3 max-w-md mx-auto">
                <a
                  href={getWhatsAppLink(COMPANY_INFO.whatsappFormatted, whatsappMsgText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Customized WhatsApp Message Now</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Message Copied!' : 'Copy WhatsApp Message Text'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Return to Sales Page
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
