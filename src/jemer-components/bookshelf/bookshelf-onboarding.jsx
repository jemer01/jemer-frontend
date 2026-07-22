/**
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — BOOKSHELF ONBOARDING MODAL (v1.0)
 * ================================================================================================
 * SUMMARY: Premium 3-step introductory flow for the digital library.
 * 1. Wide Edge-to-Edge Architecture matching ecosystem standards.
 * 2. Zero-millisecond memory flag check (`jemer_bookshelf_onboarded`).
 * 3. Pro Animations for staggered typography entry.
 */

"use client";

import React, { useState, useEffect } from "react";

export default function BookshelfOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("jemer_bookshelf_onboarded");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem("jemer_bookshelf_onboarded", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-slate-900/10 dark:bg-black/20 p-4 sm:p-6 lg:p-8">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalEnterScale {
          0% { opacity: 0; transform: scale(0.96) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes staggerSlideUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-pro { animation: modalEnterScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .stagger-1 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.15s; opacity: 0; }
        .stagger-3 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.25s; opacity: 0; }
      `}} />

      <div className="w-full lg:w-[75%] max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-[2rem] shadow-[0_0_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10 flex flex-col md:flex-row overflow-hidden relative animate-modal-pro">
        
        {/* ── LEFT COLUMN: WIDE IMAGE ZONE ── */}
        <div className="hidden md:flex md:w-[55%] bg-slate-50 dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
          
          <div key={`img-${activeStep}`} className="absolute inset-0 flex items-center justify-center p-8 stagger-1">
            <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white/50 dark:bg-slate-900/50 transition-colors">
              {activeStep === 1 && (
                <div className="text-center">
                  <i className="fas fa-book-open text-5xl mb-4 text-emerald-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 1 (BROWSE) IMAGE --&gt;
                  </p>
                </div>
              )}
              {activeStep === 2 && (
                <div className="text-center">
                  <i className="fas fa-bookmark text-5xl mb-4 text-blue-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 2 (READ) IMAGE --&gt;
                  </p>
                </div>
              )}
              {activeStep === 3 && (
                <div className="text-center">
                  <i className="fas fa-chart-line text-5xl mb-4 text-indigo-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 3 (TRACK) IMAGE --&gt;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TEXT & CONTROLS ── */}
        <div className="w-full md:w-[45%] flex flex-col justify-between p-8 lg:p-14 min-h-[80vh] md:min-h-[60vh]">
          <div key={`text-${activeStep}`} className="space-y-6">
            
            <div className="stagger-1 inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest font-mono">
              Step {activeStep} of 3
            </div>

            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Your Infinite <br/><span className="text-emerald-600 dark:text-emerald-500">Digital Library.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Access hundreds of curated textbooks, syllabus guides, and reference materials. Everything you need to excel is organized in one beautiful space.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Smart Reading <br/><span className="text-blue-500">Workspace.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Highlight texts, save essential pages, and pull up your smart notes alongside the book without ever leaving the viewport.
                </p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Track Your <br/><span className="text-indigo-500">Progress.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  The engine remembers exactly where you left off. Set reading goals, monitor your completion rates, and stay ahead of your exam schedules automatically.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60 animate-modal-pro" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <button
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
              className={`text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-4 py-2 ${activeStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              Back
            </button>

            {activeStep < 3 ? (
              <button
                onClick={() => setActiveStep(prev => Math.min(prev + 1, 3))}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Next Feature</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </button>
            ) : (
              <button
                onClick={handleCompleteOnboarding}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-teal-500/30 active:scale-95 flex items-center gap-2"
              >
                <span>Enter Library</span>
                <i className="fas fa-check text-[10px]"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}