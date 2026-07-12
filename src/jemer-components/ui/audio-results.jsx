/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 AI Audio Results Matrix.
 * 1. Mobile Text Overflow Fix: Implemented `whitespace-normal`, `break-words`, and precise flex constraints on the audio title. If a user uploads an audio file with a massively long name, it will wrap gracefully onto multiple lines on slim screens instead of breaking the UI.
 * 2. Premium Results Header: Injected the Next.js-optimized `lucide-brain` SVG inside a high-end purple/indigo gradient to match the audio theme.
 * 3. Handoff Actions: Added massive, tactile buttons to easily "Record Another" or slide up the "Chat AI" contextual tutor.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIO RESULTS ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function AudioResults({ audioData, onReset, onChat }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto p-4 sm:p-0">
      
      {/* ── AUDIO FILE IDENTITY HEADER ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center">
         <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 shadow-inner border border-purple-100 dark:border-purple-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-audio">
              <path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3.1 4 3.6 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M10 20v-1a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0Z"/><path d="M6 20v-1a2 2 0 1 0-4 0v1a2 2 0 1 0 4 0Z"/><path d="M2 19v-3a6 6 0 0 1 12 0v3"/>
            </svg>
         </div>
         
         {/* 🚀 THE FIX: `whitespace-normal` and `break-words` guarantees long titles wrap perfectly on mobile */}
         <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white leading-tight w-full max-w-lg whitespace-normal break-words px-2">
            {audioData?.name || "Audio Recording Transcription"}
         </h3>
         <p className="text-xs text-slate-500 font-mono mt-2">
            Status: Processed • {(audioData?.size / 1024 / 1024).toFixed(2) || "0.00"} MB
         </p>
      </div>

      {/* ── PRIMARY ACTION ROUTING ── */}
      <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onReset} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-4 px-6 rounded-2xl font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-xs"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic text-purple-500">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
              <span>Record Another</span>
          </button>
          <button 
            onClick={onChat} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
          >
              <i className="fas fa-comments text-sm"></i>
              <span>Chat AI</span>
          </button>
      </div>

      {/* ── AI STUDY NOTES MATRIX ── */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col mb-8">
          
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center gap-4 shrink-0">
              
              {/* Next.js Optimized Lucide Brain SVG */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
                    <path d="M12 18V5"/>
                    <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/>
                    <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/>
                    <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/>
                    <path d="M18 18a4 4 0 0 0 2-7.464"/>
                    <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/>
                    <path d="M6 18a4 4 0 0 1-2-7.464"/>
                    <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/>
                  </svg>
              </div>
              
              <div>
                <h2 className="font-display font-black text-slate-900 dark:text-white text-xl lg:text-2xl tracking-tight leading-none">
                  Transcription & Notes
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mt-1.5">
                  Extracted Core Concepts
                </p>
              </div>
          </div>
          
          {/* Dummy Markdown/Content Body */}
          <div className="p-6 md:p-8 space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="space-y-3">
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
              
              <div className="w-full h-40 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-sm p-6 text-center">
                 <i className="fas fa-list-ul text-3xl text-slate-300 dark:text-slate-700 mb-3"></i>
                 <span className="text-xs text-slate-400 font-mono tracking-wider leading-relaxed">
                   [ Markdown Structured Study Guide Render Frame ] <br/>
                   Transcript • Bullet Points • Summaries
                 </span>
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
          </div>
      </div>

    </div>
  );
}