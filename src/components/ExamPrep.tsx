import React from 'react';
import { EXAM_PROGRAMS } from '../data/copyData';
import { Award, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

interface ExamPrepProps {
  onOpenLeadModal: () => void;
}

export const ExamPrep: React.FC<ExamPrepProps> = ({ onOpenLeadModal }) => {
  return (
    <section id="exams" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Syllabus Mastery
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comprehensive Exam Preparation
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Targeted exam-focused coaching designed to guarantee high marks and smooth admission transitions.
          </p>
        </div>

        {/* Exams Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAM_PROGRAMS.map((exam) => (
            <div
              key={exam.code}
              className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-sm tracking-wider">
                    {exam.code}
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{exam.name}</h3>
                <p className="text-xs text-amber-400 font-medium mb-3">{exam.fullName}</p>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  {exam.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Intensive Batch Open
                </span>

                <button
                  onClick={onOpenLeadModal}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Prepare {exam.code}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
