"use client"; // Enforces client-side execution to enable React hooks for state and browser storage access[cite: 3]

// Import core React hooks for state handling and lifecycle side-effects[cite: 3]
import React, { useState, useEffect } from "react";

/**
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — EXAM SIMULATOR ONBOARDING MODAL (v1.0)
 * ================================================================================================
 * High-fidelity glassmorphism modal component designed to onboard users to the exam ecosystem.
 * Remembers onboarding state via browser localStorage so users only see it on their first visit[cite: 3].
 */
export default function ExamModal() {
  // ── LAYER 1: MODAL VISIBILITY STATE MANAGEMENT ────────────────────────────────────────────
  // Controls whether the modal backdrop and dialog are visible[cite: 3]
  const [isOpen, setIsOpen] = useState(false);
  
  // Tracks the active step index of the onboarding wizard (1 to 3)[cite: 3]
  const [activeStep, setActiveStep] = useState(1);

  // ── LAYER 2: PERSISTENCE INITIALIZATION CHECK ──────────────────────────────────────────────
  // Executes on initial component mount to verify if the user has previously completed onboarding[cite: 3]
  useEffect(() => {
    // Reads key from browser localStorage[cite: 3]
    const hasSeenExamOnboarding = localStorage.getItem("jemer_exam_onboarded");
    
    // If key does not exist, trigger modal popup[cite: 3]
    if (!hasSeenExamOnboarding) {
      setIsOpen(true);
    }
  }, []); // Empty dependency array ensures this effect runs exactly once on mount[cite: 3]

  // ── LAYER 3: ONBOARDING COMPLETION HANDLER ────────────────────────────────────────────────
  // Saves memory flag to localStorage and closes the modal[cite: 3]
  const handleCompleteOnboarding = () => {
    // Persist flag to browser storage[cite: 3]
    localStorage.setItem("jemer_exam_onboarded", "true");
    
    // Unmount modal view[cite: 3]
    setIsOpen(false);
  };

  // If modal state is set to false, render nothing to DOM[cite: 3]
  if (!isOpen) return null;

  return (
    // 📡 MODAL BACKDROP CONTAINER: Translucent backdrop blur layer locked to viewport overlay[cite: 3]
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-slate-900/20 dark:bg-black/40 p-4 sm:p-6 lg:p-8">
      
      {/* 🚀 CSS ANIMATION INJECTION ENGINE: Custom keyframes for entry scale and staggered text reveals[cite: 3] */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalEnterScale {
          0% { opacity: 0; transform: scale(0.96) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes staggerSlideUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-pro { 
          animation: modalEnterScale 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .stagger-1 { 
          animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          animation-delay: 0.05s; 
          opacity: 0; 
        }
        .stagger-2 { 
          animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          animation-delay: 0.15s; 
          opacity: 0; 
        }
        .stagger-3 { 
          animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          animation-delay: 0.25s; 
          opacity: 0; 
        }
      `}} />

      {/* 🏛️ MASTER GLASSMORPHISM DIALOG CONTAINER[cite: 3] */}
      <div className="w-full lg:w-[75%] max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-[2rem] shadow-[0_0_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10 flex flex-col md:flex-row overflow-hidden relative animate-modal-pro">
        
        {/* ── LEFT COLUMN: VISUAL FEATURE IMAGE ZONE ──[cite: 3] */}
        {/* Hidden on mobile, takes 55% width on desktop viewports[cite: 3] */}
        <div className="hidden md:flex md:w-[55%] bg-slate-50 dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          
          {/* Ambient radial glow effect centered in image box[cite: 3] */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Keyed container forces animation re-triggering upon active step transition[cite: 3] */}
          <div key={`img-${activeStep}`} className="absolute inset-0 flex items-center justify-center p-8 stagger-1">
            
            {/* Visual step placeholder graphic box[cite: 3] */}
            <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white/50 dark:bg-slate-900/50 transition-colors">
              
              {/* Step 1 Graphic Placeholder */}
              {activeStep === 1 && (
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 1 (STANDARD EXAMS) GRAPHIC --&gt;
                  </p>
                </div>
              )}

              {/* Step 2 Graphic Placeholder */}
              {activeStep === 2 && (
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 2 (STUDY ROOM) GRAPHIC --&gt;
                  </p>
                </div>
              )}

              {/* Step 3 Graphic Placeholder */}
              {activeStep === 3 && (
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 3 (ANALYTICS) GRAPHIC --&gt;
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TEXT CONTENT & ACTION CONTROLS ──[cite: 3] */}
        <div className="w-full md:w-[45%] flex flex-col justify-between p-8 lg:p-12 min-h-[70vh] md:min-h-[55vh]">
          
          {/* Keyed container triggers staggered text slide-up animations per step[cite: 3] */}
          <div key={`text-${activeStep}`} className="space-y-6">
            
            {/* Active Step Indicator Pill Badge[cite: 3] */}
            <div className="stagger-1 inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest font-mono">
              Step {activeStep} of 3
            </div>

            {/* Dynamic Title and Copy Switching based on Active Step[cite: 3] */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Master National <br/><span className="text-emerald-600 dark:text-emerald-400">Standardized CBTs.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Experience real examination environments for JAMB CBT and WAEC. Test under timed conditions, learn real countdown pacing, and get acquainted with modern exam formats.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Learn at your pace in <br/><span className="text-purple-600 dark:text-purple-400">AI Study-Room.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  No timers, no exam stress. Practice single subjects with instant step-by-step AI breakdowns for every question to lock in core concept understanding.
                </p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Hunt Questions & <br/><span className="text-blue-600 dark:text-blue-400">Track Analytics.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Search millions of past exam questions across any topic with Questions Hunter, and review performance metrics to pinpoint weak areas before test day.
                </p>
              </div>
            )}
          </div>

          {/* Modal Bottom Controls Navigation Bar[cite: 3] */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60">
            
            {/* Back Navigation Button[cite: 3] */}
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
              className={`text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-4 py-2 ${
                activeStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              Back
            </button>

            {/* Next Step / Complete Action Button[cite: 3] */}
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.min(prev + 1, 3))}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>Next Feature</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
              >
                <span>Start Practicing</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}