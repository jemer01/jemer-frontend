"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING HOME (v4.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.0.0]
 * SUMMARY: Phase 2 Blue/White Theme, Prompt Persistence & Mobile Ergonomics
 * 1. THE GREAT RE-THEME: Completely stripped all `rose`, `pink`, and `crimson` classes. Standardized 
 *    the entire visual palette to Jemer Academy's official `blue`, `indigo`, and `slate` tokens.
 * 2. PROMPT PERSISTENCE: Hooked the textarea into `localStorage` (`jemer_brain_prompt_draft`). If a 
 *    student types a long prompt, clicks away, and comes back, their text is preserved safely.
 * 3. WIDER MOBILE PROMPT BOX: Removed restrictive side margins on the main prompt container on small 
 *    screens, allowing it to span gracefully edge-to-edge.
 * 4. PRO AUTO-PROMPTS: Replaced generic starters with highly specific, academic "Brain Training" 
 *    concepts complete with SVG neural icons.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import BrainTrainingHistory from "./brain-training-history";

export default function BrainTraining({ onStartNew, onResume, onOpenPerformance }) {
  const [promptText, setPromptText] = useState("");

  // 🚀 FIXED: Restore draft from LocalStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("jemer_brain_prompt_draft");
    if (savedDraft) {
      setPromptText(savedDraft);
    }
  }, []);

  const handlePromptChange = (e) => {
    const text = e.target.value;
    setPromptText(text);
    localStorage.setItem("jemer_brain_prompt_draft", text);
  };

  const setAutoPrompt = (text) => {
    setPromptText(text);
    localStorage.setItem("jemer_brain_prompt_draft", text);
  };

  const handleLaunch = () => {
    if (!promptText.trim()) return;
    localStorage.removeItem("jemer_brain_prompt_draft"); // Clear on successful launch
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
      <div className="w-full min-h-[50vh] sm:min-h-[60vh] flex flex-col items-center justify-center text-center relative px-2 sm:px-6">
        
        {/* 🚀 FIXED: Ambient Blue/Indigo Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[60%] h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="relative z-10 w-full max-w-4xl space-y-8">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest font-mono bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 shadow-sm mx-auto">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Global Cognitive Gym
            </div>
            {/* 🚀 FIXED: Re-themed gradient */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight px-1">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Any Topic</span> Instantly
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed px-1">
              No geographical limits. No rigid curricula. Enter any concept in the universe, and the Jemer AI Engine will build a custom interactive training session to force cognitive adaptation.
            </p>

            {/* AI Tutor vs Brain Training Explainer */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mx-auto pt-2 text-left">
              <div className="flex-1 flex items-start gap-3 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-snug">
                  <span className="font-black text-slate-900 dark:text-white">AI Tutor</span> teaches you by explaining concepts, step by step.
                </p>
              </div>
              <div className="flex-1 flex items-start gap-3 px-4 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-900/50">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
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

          {/* 🚀 FIXED: Wider prompt box on mobile, re-themed borders */}
          <div className="w-full bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-900/50 shadow-2xl rounded-[1.75rem] sm:rounded-3xl p-2.5 sm:p-2 relative group focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300">
            <textarea
              value={promptText}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Teach me the foundational principles of Quantum Physics..."
              className="w-full h-36 sm:h-40 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-base sm:text-lg font-medium p-3.5 sm:p-4 resize-none outline-none brain-premium-scroll"
            />
            
            {/* Control Bar inside the Prompt Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-2 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              
              <div className="flex gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible sm:flex-wrap -mx-1 px-1 sm:mx-0 sm:px-0 pb-1 sm:pb-0 brain-premium-scroll">
                <button 
                  onClick={() => setAutoPrompt("Neural Network Backpropagation mechanics and math.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Neural Networks
                </button>
                <button 
                  onClick={() => setAutoPrompt("Macroeconomic Inflation Policies and Central Banking.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Macroeconomics
                </button>
                <button 
                  onClick={() => setAutoPrompt("Cellular Respiration and ATP Synthesis step by step.")} 
                  className="shrink-0 px-2.5 py-1.5 sm:px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  Biology
                </button>
              </div>

              <button 
                onClick={handleLaunch}
                disabled={!promptText.trim()}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Generate Plan</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

            </div>
          </div>

        </div>
      </div>

      <div className="w-full pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <div className="w-full">
          <BrainTrainingHistory onResume={onResume} />
        </div>

        <div className="mt-12 mb-4 w-full flex justify-center px-4">
          <button 
            onClick={onOpenPerformance}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-black text-xs sm:text-sm uppercase tracking-widest shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 focus:outline-none"
          >
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span>View Past Results & Analytics</span>
          </button>
        </div>
      </div>

    </div>
  );
}