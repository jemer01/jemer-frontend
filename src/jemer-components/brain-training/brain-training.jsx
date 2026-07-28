// src/jemer-components/brain-training/brain-training.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - BRAIN TRAINING HOME)
 * ================================================================================================
 * 1. EDGE-TO-EDGE PROMPT BOX: Built a massive, beautifully centered prompt input acting as the 
 *    gateway to global cognitive mastery. Features a glowing Rose/Crimson aura.
 * 2. SUGGESTION PILLS: Added quick-click topics (Quantum Physics, Closures, etc.) to instantly 
 *    fill the prompt box and accelerate UX.
 * 3. HISTORY INTEGRATION: Flawlessly imports and renders the `<BrainTrainingHistory />` component 
 *    directly below the hero section so users can scroll to see past modules.
 * 4. PURE REACT SVGS: Utilized ultra-crisp native SVGs for the send arrow and UI accents.
 * ================================================================================================
 */

import React, { useState } from "react";
import BrainTrainingHistory from "./brain-training-history";

export default function BrainTraining({ onStartNew, onResume }) {
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
    <div className="w-full max-w-7xl mx-auto space-y-16 animate-fade-in pb-12">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HERO: AI PROMPT BOX 
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center relative px-4">
        
        {/* Ambient Crimson Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-96 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-4xl space-y-8">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Global Cognitive Gym
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Any Topic</span> Instantly
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
              No geographical limits. No rigid curricula. Enter any concept in the universe, and the Jemer AI Engine will build a custom interactive training session to force cognitive adaptation.
            </p>
          </div>

          {/* Interactive Prompt Box */}
          <div className="w-full bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-900/50 shadow-2xl rounded-3xl p-2 relative group focus-within:ring-4 focus-within:ring-rose-500/20 transition-all duration-300">
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Teach me the foundational principles of Quantum Physics..."
              className="w-full h-32 sm:h-40 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg font-medium p-4 resize-none outline-none brain-premium-scroll"
            />
            
            {/* Control Bar inside the Prompt Box */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-2 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setPromptText("Advanced JavaScript Closures and Scope Chains.")} 
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors"
                >
                  JavaScript Closures
                </button>
                <button 
                  onClick={() => setPromptText("The mechanics of Global Financial Markets and Stock Shorting.")} 
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors"
                >
                  Financial Markets
                </button>
                <button 
                  onClick={() => setPromptText("The Laws of Thermodynamics explained step by step.")} 
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] sm:text-xs font-bold transition-colors"
                >
                  Thermodynamics
                </button>
              </div>

              <button 
                onClick={handleLaunch}
                disabled={!promptText.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
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
          SCROLL REVEAL: HISTORY GRID
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full pt-10 border-t border-slate-200 dark:border-slate-800">
        <BrainTrainingHistory onResume={onResume} />
      </div>

    </div>
  );
}