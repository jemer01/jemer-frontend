/**
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — BOOKSHELF ONBOARDING MODAL (v1.1)
 * ================================================================================================
 * NEW: Rebuilt the first-visit onboarding as a text-first, viewport-contained experience with
 * blue/white design tokens, mobile-safe sizing, accessible controls, and permanent localStorage
 * persistence. The onboarding now appears only on the first successful visit.
 */

"use client";

import React, { useState, useEffect } from "react";

export default function BookshelfOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    try {
      const hasSeenOnboarding = localStorage.getItem("jemer_bookshelf_onboarded");

      if (!hasSeenOnboarding) {
        setIsOpen(true);
        localStorage.setItem("jemer_bookshelf_onboarded", "true");
      }
    } catch (error) {
      // Keep the onboarding usable if browser storage is unavailable.
      setIsOpen(true);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem("jemer_bookshelf_onboarded", "true");
    } catch (error) {
      // The onboarding can still close if storage is unavailable.
    }

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 dark:bg-black/75 backdrop-blur-sm p-4 sm:p-6">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalEnterScale {
          0% { opacity: 0; transform: scale(0.98) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes staggerSlideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-pro { animation: modalEnterScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .stagger-1 { animation: staggerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.03s; opacity: 0; }
        .stagger-2 { animation: staggerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.08s; opacity: 0; }
        .stagger-3 { animation: staggerSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.13s; opacity: 0; }
        @media (prefers-reduced-motion: reduce) {
          .animate-modal-pro, .stagger-1, .stagger-2, .stagger-3 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      ` }} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookshelf-onboarding-title"
        className="w-full max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl animate-modal-pro"
      >
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <span className="stagger-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest">
                Digital Library
              </span>

              <p className="stagger-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                {activeStep} of 3
              </p>
            </div>

            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          {/* ── PROGRESS ── */}
          <div className="mt-6 flex gap-2" aria-hidden="true">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
                  step <= activeStep
                    ? "bg-blue-600 dark:bg-blue-400"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>

          {/* ── TEXT CONTENT ── */}
          <div key={activeStep} className="mt-8 min-h-[190px] sm:min-h-[210px] flex flex-col justify-center">
            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 id="bookshelf-onboarding-title" className="stagger-2 text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Find the books you need to study smarter.
                </h2>
                <p className="stagger-3 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                  Browse curated textbooks and academic resources, then use search and categories to get to the right material faster.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h2 id="bookshelf-onboarding-title" className="stagger-2 text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Keep your learning in one place.
                </h2>
                <p className="stagger-3 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                  The bookshelf is being built into a focused digital reading space for your study materials and future learning tools.
                </p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h2 id="bookshelf-onboarding-title" className="stagger-2 text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Your digital reading experience is coming.
                </h2>
                <p className="stagger-3 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                  Interactive reading, saved progress, highlighting, and AI-powered study tools are being prepared for the full Bookshelf experience.
                </p>
              </div>
            )}
          </div>

          {/* ── CONTROLS ── */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
              className={`min-h-12 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                activeStep === 1 ? "invisible pointer-events-none" : "visible"
              }`}
              aria-label="Go to previous onboarding step"
            >
              Back
            </button>

            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(prev + 1, 3))}
                className="min-h-12 px-5 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>Continue</span>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="min-h-12 px-5 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.99] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                <span>Explore Bookshelf</span>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
