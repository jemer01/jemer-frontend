/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 Pro UI & Animation Overhaul.
 * 1. Wide Edge-to-Edge Architecture: Expanded to `lg:w-[75%] max-w-6xl` and dedicated 55% of the width to the image zone on desktop.
 * 2. Mobile Optimization: Applied `hidden md:flex` to the image zone so it vanishes on phones, and forced the text container to `min-h-[80vh]` for an expansive mobile feel.
 * 3. Transparent Backdrop Blur: Replaced the heavy black tint with a clean `backdrop-blur-md bg-white/5 dark:bg-black/10` to keep the dashboard visible but unfocused.
 * 4. Premium UI Surface: Added glassmorphism (`bg-white/95`), an inner light ring (`ring-1 ring-white/50`), and deep ambient shadows.
 * 5. Pro Animations: Injected custom `@keyframes` for a smooth scale-up entry, and staggered slide-ups for the text content on every step change.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — LEARNING TOOLS ONBOARDING MODAL (v2.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow React hooks

import React, { useState, useEffect } from "react";

export default function ToolsOnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Run a 0ms cache check on mount to see if the user has been here before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("jemer_tools_onboarded");
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  // Close function that commits the memory flag to the browser
  const handleCompleteOnboarding = () => {
    localStorage.setItem("jemer_tools_onboarded", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    // 📡 MODAL BACKDROP: Set to z-20. Clean blur without the heavy black tint.
    <div className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-md bg-slate-900/10 dark:bg-black/20 p-4 sm:p-6 lg:p-8">
      
      {/* 🚀 CSS INJECTION: Custom Pro Animations for the Modal */}
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
        
        /* Staggered text delays so the UI cascades beautifully when switching steps */
        .stagger-1 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.05s; opacity: 0; }
        .stagger-2 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.15s; opacity: 0; }
        .stagger-3 { animation: staggerSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.25s; opacity: 0; }
      `}} />

      {/* 🏛️ 75% WIDE MASTER CONTAINER */}
      {/* Premium glass surface, wide footprint, and smooth entry animation */}
      <div className="w-full lg:w-[75%] max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-[2rem] shadow-[0_0_80px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10 flex flex-col md:flex-row overflow-hidden relative animate-modal-pro">
        
        {/* ── LEFT COLUMN: WIDE IMAGE ZONE ── */}
        {/* HIDDEN ON MOBILE. Takes up 55% of the modal width on desktop. Edge-to-edge flush. */}
        <div className="hidden md:flex md:w-[55%] bg-slate-50 dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 relative overflow-hidden">
          
          {/* Subtle background glow effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Using key={activeStep} forces React to remount this div, re-triggering the entrance animation */}
          <div key={`img-${activeStep}`} className="absolute inset-0 flex items-center justify-center p-8 stagger-1">
            {/* 🛑 INSTRUCTED PLACEHOLDER: Image Injection Block */}
            <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white/50 dark:bg-slate-900/50 transition-colors">
              {activeStep === 1 && (
                <div className="text-center">
                  <i className="fas fa-camera text-5xl mb-4 text-blue-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 1 (SNAP) IMAGE HERE --&gt;
                  </p>
                </div>
              )}
              {activeStep === 2 && (
                <div className="text-center">
                  <i className="fab fa-youtube text-5xl mb-4 text-red-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 2 (VID2NOTES) IMAGE HERE --&gt;
                  </p>
                </div>
              )}
              {activeStep === 3 && (
                <div className="text-center">
                  <i className="fas fa-headphones text-5xl mb-4 text-purple-500/50"></i>
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
                    &lt;!-- INJECT STEP 3 (AUDIO) IMAGE HERE --&gt;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: TEXT & CONTROLS ── */}
        {/* Takes up 45% on desktop. Min-height of 80vh ensures a tall, premium feel on mobile devices. */}
        <div className="w-full md:w-[45%] flex flex-col justify-between p-8 lg:p-14 min-h-[80vh] md:min-h-[60vh]">
          
          {/* Using key={activeStep} to stagger animate the text content when the user clicks next */}
          <div key={`text-${activeStep}`} className="space-y-6">
            
            {/* Step Counter Pill */}
            <div className="stagger-1 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest font-mono">
              Step {activeStep} of 3
            </div>

            {/* Dynamic Content Switching */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Solve anything with <br/><span className="text-blue-600 dark:text-blue-500">Snap to Answer.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Stuck on a complex math equation or a confusing diagram? Don't type it out. Just snap a photo. Our advanced computer vision AI will decode the logic instantly and provide a step-by-step breakdown.
                </p>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Turn videos into <br/><span className="text-red-500">Structured Notes.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Stop pausing and rewinding. Paste any YouTube lecture link into Vid2Notes. The intelligence engine will extract the transcript, pull the core concepts, and build a premium study guide for you in seconds.
                </p>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h2 className="stagger-2 text-3xl lg:text-4xl font-display font-black text-slate-900 dark:text-white leading-tight">
                  Transcribe your <br/><span className="text-purple-500">Audio Lectures.</span>
                </h2>
                <p className="stagger-3 text-sm lg:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have a voice recording from class? Upload your device audio files directly. The AI processes speech patterns to generate accurate transcripts, highlighting key definitions and learning moments automatically.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/60 animate-modal-pro" style={{ animationDelay: '0.4s', opacity: 0 }}>
            {/* Back Button */}
            <button
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
              className={`text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors px-4 py-2 ${activeStep === 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              Back
            </button>

            {/* Next / Complete Action Button */}
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
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/30 active:scale-95 flex items-center gap-2"
              >
                <span>Okay, Let's Go!</span>
                <i className="fas fa-check text-[10px]"></i>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}