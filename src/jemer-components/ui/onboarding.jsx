"use client";

/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Unified Master Onboarding Modal (v3.2 - JemerPlay Integration)
 * 1. JEMERPLAY CONTEXT UPDATE: Completely replaced "Vid2Notes" in Step 2 of the Tools module with 
 *    the "JemerPlay" context, matching the exact wording and red theme from `tools-widgets.jsx`.
 * 2. NEXT.JS STATE BLEED FIX: Kept the `key={moduleType}` wrapper to guarantee isolation.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — UNIFIED ONBOARDING ENGINE
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";

// The master dictionary containing the exact text and keys for all three modules
const ONBOARDING_DATA = {
  tools: {
    storageKey: "jemer_tools_onboarded",
    tagline: "Learning Tools",
    finalButton: "Okay, Let's Go!",
    steps: [
      {
        title: <>Solve anything with <br/><span className="text-blue-600 dark:text-blue-500">Snap to Answer.</span></>,
        description: "Stuck on a complex math equation or a confusing diagram? Don't type it out. Just snap a photo. Our advanced computer vision AI will decode the logic instantly and provide a step-by-step breakdown."
      },
      // 🚀 FIXED: Swapped Vid2Notes for JemerPlay and pulled context from the widget
      {
        title: <>Explore videos with <br/><span className="text-red-600 dark:text-red-500">JemerPlay.</span></>,
        description: "Search and explore thousands of educational video lectures. Watch natively in theater-mode and build your own library with our advanced semantic vector cache."
      },
      {
        title: <>Transcribe your <br/><span className="text-purple-500">Audio Lectures.</span></>,
        description: "Have a voice recording from class? Upload your device audio files directly. The AI processes speech patterns to generate accurate transcripts, highlighting key definitions and learning moments automatically."
      }
    ]
  },
  exam: {
    storageKey: "jemer_exam_onboarded",
    tagline: "Exam Simulator",
    finalButton: "Start Practicing",
    steps: [
      {
        title: <>Master National <br/><span className="text-emerald-600 dark:text-emerald-400">Standardized CBTs.</span></>,
        description: "Experience real examination environments for JAMB CBT and WAEC. Test under timed conditions, learn real countdown pacing, and get acquainted with modern exam formats."
      },
      {
        title: <>Learn at your pace in <br/><span className="text-purple-600 dark:text-purple-400">AI Study-Room.</span></>,
        description: "No timers, no exam stress. Practice single subjects with instant step-by-step AI breakdowns for every question to lock in core concept understanding."
      },
      {
        title: <>Hunt Questions & <br/><span className="text-blue-600 dark:text-blue-400">Track Analytics.</span></>,
        description: "Search millions of past exam questions across any topic with Questions Hunter, and review performance metrics to pinpoint weak areas before test day."
      }
    ]
  },
  bookshelf: {
    storageKey: "jemer_bookshelf_onboarded",
    tagline: "Digital Library",
    finalButton: "Explore Bookshelf",
    steps: [
      {
        title: <>Find the books you need to study smarter.</>,
        description: "Browse curated textbooks and academic resources, then use search and categories to get to the right material faster."
      },
      {
        title: <>Keep your learning in one place.</>,
        description: "The bookshelf is being built into a focused digital reading space for your study materials and future learning tools."
      },
      {
        title: <>Your digital reading experience is coming.</>,
        description: "Interactive reading, saved progress, highlighting, and AI-powered study tools are being prepared for the full Bookshelf experience."
      }
    ]
  }
};

export default function OnboardingModal({ moduleType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Safely grab the configuration for the requested module
  const moduleConfig = ONBOARDING_DATA[moduleType];

  useEffect(() => {
    // Failsafe: Log an error if a bad prop is passed and abort execution
    if (!moduleConfig) {
      console.error(`[OnboardingModal] Invalid or missing moduleType: ${moduleType}`);
      return; 
    }

    // Always reset to step 1 when the module type changes
    setActiveStep(1);

    try {
      const hasSeenOnboarding = localStorage.getItem(moduleConfig.storageKey);
      if (!hasSeenOnboarding) {
        setIsOpen(true);
      } else {
        setIsOpen(false); // Ensure it stays closed if they already saw it
      }
    } catch (error) {
      // Graceful degradation if localStorage is blocked (e.g., incognito mode)
      setIsOpen(true);
    }
  }, [moduleType, moduleConfig]);

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem(moduleConfig.storageKey, "true");
    } catch (error) {
      // Catch exceptions to ensure the modal still closes even if storage fails
    }
    setIsOpen(false);
  };

  if (!isOpen || !moduleConfig) return null;

  const currentStepData = moduleConfig.steps[activeStep - 1];

  return (
    // 🚀 FIXED: Added key={moduleType} to force Next.js to destroy and remount the DOM node
    // 📡 MODAL BACKDROP: Fixed viewport, hidden overflow, touch-none completely prevents background scrolling.
    <div key={moduleType} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-md overflow-hidden touch-none p-4 sm:p-6">
      
      {/* 🚀 CSS INJECTION: Custom Pro Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes modalEnterScale {
          0% { opacity: 0; transform: scale(0.96) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes staggerSlideUp {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-pro { animation: modalEnterScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .stagger-1 { animation: staggerSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation: staggerSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.15s; opacity: 0; }
        .stagger-3 { animation: staggerSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.25s; opacity: 0; }
        @media (prefers-reduced-motion: reduce) {
          .animate-modal-pro, .stagger-1, .stagger-2, .stagger-3 {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
        }
      `}} />

      {/* 🏛️ MASTER TEXT-ONLY CONTAINER */}
      <div 
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl ring-1 ring-white/50 dark:ring-white/10 flex flex-col relative animate-modal-pro"
      >
        <div className="p-8 lg:p-10 flex flex-col justify-between min-h-[350px]">
          
          {/* HEADER: Tagline & Step Counter */}
          <div className="flex items-center justify-between mb-8">
            <span className="stagger-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest">
              {moduleConfig.tagline}
            </span>
            <span className="stagger-1 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              Step {activeStep} of 3
            </span>
          </div>

          {/* DYNAMIC TEXT CONTENT */}
          {/* Using key forces React to restart the staggered animations on step change */}
          <div key={`text-${activeStep}`} className="space-y-4 flex-1 flex flex-col justify-center">
            <h2 className="stagger-2 text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
              {currentStepData.title}
            </h2>
            <p className="stagger-3 text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              {currentStepData.description}
            </p>
          </div>

          {/* CONTROLS (FOOTER) */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
              className={`min-h-12 px-4 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors focus-visible:outline-none ${
                activeStep === 1 ? "invisible pointer-events-none" : "visible"
              }`}
            >
              Back
            </button>

            {/* Next / Complete Action Button */}
            {activeStep < 3 ? (
              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.min(prev + 1, 3))}
                className="min-h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center gap-2 focus-visible:outline-none"
              >
                <span>Next</span>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompleteOnboarding}
                className="min-h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] flex items-center gap-2 focus-visible:outline-none"
              >
                <span>{moduleConfig.finalButton}</span>
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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