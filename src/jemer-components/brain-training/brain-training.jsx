// src/jemer-components/brain-training/brain-training.jsx
"use client";

/**
 * [NEW UPGRADE]
 * SUMMARY: v2.1 Explainer Copy & Full Mobile Responsiveness Pass.
 * 1. Explainer Row: Added an "AI Tutor vs Brain Training" comparison block under the hero copy, clarifying that Brain Training drills you with problems to solve, while the AI Tutor teaches by explaining concepts.
 * 2. Mobile Optimization: Rebalanced hero type scale, spacing, and prompt-box padding across breakpoints; suggestion chips now scroll horizontally on narrow screens instead of crowding/wrapping.
 * 3. Component Integrity: No logic, routing, or existing visual elements (glow orbs, layout structure, performance CTA) were removed or altered outside the stated scope.
 * ────────────────────────────────────────────────────────────────────────────────────────
 * [PRIOR] v2.0 Performance Archive Route Integration.
 * 1. Performance Dashboard CTA: Injected a premium "View Past Results & Analytics" button below the history grid. When clicked, it triggers the `onOpenPerformance` prop to route the user seamlessly into the completed exams archive.
 * 2. Component Integrity: Preserved 100% of the glowing orbs, typewriter layout, prompt logic, and history grid integration.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING HOME (v2.1)
 * ================================================================================================
 */

import React, { useState } from "react";
import BrainTrainingHistory from "./brain-training-history";

export default function BrainTraining({ onStartNew, onResume, onOpenPerformance }) {
  const [promptText, setPromptText] = useState("");

  const handleLaunch = () => {
    if (!promptText.trim()) return;
    onStartNew(promptText.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLaunch();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 sm:space-y-16 animate-fade-in pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HERO: AI PROMPT BOX 
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center text-center relative px-4 sm:px-6">
        
        {/* Ambient Crimson Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-96 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-4xl space-y-8">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Global Cognitive Gym
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight px-1">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Any Topic</span> Instantly
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed px-1">
              No geographical limits. No rigid curricula. Enter any concept in the universe, and the Jemer AI Engine will build a custom interactive training session to force cognitive adaptation.
            </p>

            {/* 🆕 AI Tutor vs Brain Training Explainer */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto pt-2 text-left">
              <div className="flex-1 flex items-start gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                  <span className="font-black text-slate-900 dark:text-white">AI Tutor</span> teaches you by explaining concepts, step by step.
                </p>
              </div>
              <div className="flex-1 flex items-start gap-3 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                  <span className="font-black text-slate-900 dark:text-white">Brain Training</span> teaches you by giving you problems to solve.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Prompt Box */}
          <div className="w-full bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/50 shadow-2xl rounded-[1.75rem] sm:rounded-3xl p-2.5 sm:p-2 relative group focus-within:ring-4 focus-within:ring-rose-500/20 transition-all duration-300">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Teach me the foundational principles of Quantum Physics..."
              className="w-full h-36 sm:h-40 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg font-medium p-3.5 sm:p-4 resize-none outline-none brain-premium-scroll"
            />
            
            {/* Control Bar inside the Prompt Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-2 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible sm:flex-wrap -mx-1 px-1 sm:mx-0 sm:px-0 pb-1 sm:pb-0 brain-premium-scroll">
                <button 
                  onClick={() => setPromptText("Advanced JavaScript Closures and Scope Chains.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap"
                >
                  JavaScript Closures
                </button>
                <button 
                  onClick={() => setPromptText("The mechanics of Global Financial Markets and Stock Shorting.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Financial Markets
                </button>
                <button 
                  onClick={() => setPromptText("The Laws of Thermodynamics explained step by step.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Thermodynamics
                </button>
              </div>

              <button 
                onClick={handleLaunch}
                disabled={!promptText.trim()}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Generate Plan</span>
                {/* 🆕 Arrow Up/Right Native SVG */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          SCROLL REVEAL: HISTORY GRID & PERFORMANCE ARCHIVE CTA
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <div className="w-full">
          <BrainTrainingHistory onResume={onResume} />
        </div>

        {/* 🚀 NEW: Performance Dashboard Link */}
        <div className="mt-12 mb-4 w-full flex justify-center px-4">
          <button 
            onClick={onOpenPerformance}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-black text-xs sm:text-sm uppercase tracking-widest shadow-sm hover:shadow-lg hover:border-rose-300 dark:hover:border-rose-700 transition-all flex items-center justify-center gap-3 active:scale-95 focus:outline-none"
          >
            <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span>View Past Results & Analytics</span>
          </button>
        </div>
      </div>

    </div>
  );
}