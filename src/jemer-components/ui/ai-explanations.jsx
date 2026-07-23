"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - STUDY ROOM AI EXPLANATION MODAL)
 * ================================================================================================
 * 1. REACT PORTAL TELEPORTATION: Wraps the modal in `createPortal` attached to `document.body`. 
 *    This completely breaks it out of the parent container's CSS flow, fixing any scrolling bugs 
 *    and ensuring it locks perfectly to the center of the viewport on all screens.
 * 2. EDTECH PURPLE GLASSMORPHISM: Features a sleek, responsive UI with deep purple (`purple-600`) 
 *    and fuchsia accents to match the Study Room's dedicated learning theme.
 * 3. ADVANCED MARKDOWN/KATEX INTEGRATION: Passes the raw AI explanation directly into our decoupled 
 *    `MarkdownRenderer` engine so tables, code blocks, and complex mathematical formulas (LaTeX) 
 *    render flawlessly within the modal walls.
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer";

/**
 * AI Explanations Modal Component
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Closes the modal and returns to the session
 * @param {Object} questionContext - Contains the question text, user's wrong answer, and correct answer
 * @param {string} explanationText - The raw markdown/LaTeX string provided by the AI tutor
 */
export default function AiExplanations({ isOpen, onClose, questionContext, explanationText }) {
  // Mount state tracker to safely execute React Portals on the client without SSR hydration crashing
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Lock background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Do not render anything on the server or if modal is closed
  if (!mounted || !isOpen) return null;

  // Safe fallback for text while AI is generating/fetching
  const renderExplanation = explanationText || "*The AI Tutor is analyzing this concept...*";

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-300 animate-fade-in">
      
      {/* Premium custom scrollbar for the modal body */}
      <style dangerouslySetInnerHTML={{__html: `
        .study-modal-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .study-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .study-modal-scroll::-webkit-scrollbar-thumb { background-color: rgba(147, 51, 234, 0.4); border-radius: 10px; }
        .study-modal-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(147, 51, 234, 0.7); }
      `}} />

      {/* Invisible click-away dim layer safely handles closure paths */}
      <div onClick={onClose} className="absolute inset-0 cursor-pointer" />

      {/* Master Viewport Container */}
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-purple-200/50 dark:border-purple-700/50 shadow-2xl z-10 rounded-3xl flex flex-col overflow-hidden relative max-h-[90vh] sm:max-h-[85vh] animate-slide-up">
        
        {/* HEADER REGION (EdTech Purple Gradient) */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-between shrink-0 shadow-md relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner shrink-0 text-white border border-white/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-display font-black text-white tracking-tight leading-tight">
                Jemer AI Tutor Explanation
              </h3>
              <p className="text-[10px] font-mono font-semibold text-purple-100 tracking-wider uppercase mt-0.5">
                Active Learning Mode
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer focus:outline-none"
            title="Close Explanation"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* BODY REGION: Scrollable content container */}
        <div className="px-6 py-6 flex-1 overflow-y-auto study-modal-scroll flex flex-col gap-6 bg-slate-50 dark:bg-slate-950/50">
           
           {/* Question Context Snippet */}
           {questionContext && (
             <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-rose-500 border-y border-r border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-3 shrink-0">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                   Question Review
                 </span>
                 <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                   Incorrect
                 </span>
               </div>
               
               <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                 {questionContext.questionText}
               </p>

               <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold pt-2 border-t border-slate-100 dark:border-slate-700/50">
                 <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                   <span>You chose: {questionContext.userAnswer || "None"}</span>
                 </div>
                 <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   <span>Correct: {questionContext.correctAnswer}</span>
                 </div>
               </div>
             </div>
           )}

           {/* Markdown Rendered Explanation Area */}
           <div className="flex-1 w-full bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-sm">
             <h4 className="text-sm font-black text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-fuchsia-500 shrink-0" /> Let's break it down:
             </h4>
             
             {/* Uses the premium markdown renderer so tables and math drop in perfectly */}
             <div className="w-full relative">
               <MarkdownRenderer text={renderExplanation} />
             </div>
           </div>

        </div>

        {/* FOOTER REGION: Action trigger */}
        <div className="px-6 py-4 border-t border-purple-100 dark:border-purple-800/50 shrink-0 flex items-center justify-end bg-white dark:bg-slate-900 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-purple-500/30 active:scale-95 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 flex items-center justify-center gap-2"
          >
            <span>Got it, Let's Continue</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}