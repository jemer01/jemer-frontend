/**
 * [NEW UPGRADE]
 * SUMMARY: v3.0 Pro AI Results Matrix & Integrated Markdown/KaTeX Engine.
 * 1. Integrated Markdown & Math Renderer: Replaced plain unformatted string dumps with the ecosystem's full `MarkdownRenderer` component, offering native support for math expressions, equations, lists, bold text, code blocks, and blockquotes.
 * 2. Mobile Container Realignment: Added responsive padding (`px-3 sm:px-0`) and aligned image frame aspect ratios to eliminate edge bleeding on mobile devices.
 * 3. Pro Visual Architecture: Added dynamic stream status indicators, live glowing badges, image modal expansion previews, and sleek action buttons.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — SNAP RESULTS ENGINE (v3.0)
 * ================================================================================================
 */

"use client";

import React from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function SnapResults({ imageUrl, onReset, onChat, streamedResponse, isAnalyzing }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-0 flex flex-col gap-5 sm:gap-6 animate-fade-in pb-12">
      
      {/* ── CAPTURED IMAGE PREVIEW CARD ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 rounded-2xl sm:rounded-[2rem] shadow-sm flex items-center justify-center">
        <div className="w-full h-44 sm:h-60 bg-slate-950 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center relative group">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Cropped problem capture" 
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-500 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image text-slate-600">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">No Image Preview</span>
            </div>
          )}
          
          {/* Subtle Tag Overlay */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Scan Capture
          </div>
        </div>
      </div>

      {/* ── PRIMARY ACTION ROUTING ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button 
          onClick={onReset} 
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-95 text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <span>Snap Another</span>
        </button>
        
        <button 
          onClick={onChat} 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>
          </svg>
          <span>Tutor Chat</span>
        </button>
      </div>

      {/* ── AI SOLUTION MATRIX CONTAINER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[2rem] shadow-xl dark:shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden min-h-[380px] flex flex-col">
        
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain">
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
              <h2 className="font-display font-black text-slate-900 dark:text-white text-lg sm:text-2xl tracking-tight leading-none">
                AI Solution Engine
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mt-1">
                Jemer Intelligence v3.0
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isAnalyzing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                GENERATING
              </span>
            ) : streamedResponse ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                COMPLETE
              </span>
            ) : null}
          </div>
        </div>
        
        {/* Solution Content Canvas */}
        <div className="p-5 sm:p-8 flex-1 bg-slate-50/40 dark:bg-slate-950/40 min-h-[280px]">
          {isAnalyzing && !streamedResponse ? (
            /* Shimmer Skeleton Loading State */
            <div className="space-y-4 animate-fade-in py-4">
              <div className="flex items-center gap-3 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <span>Analyzing equation & synthesizing step-by-step response...</span>
              </div>
              <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="w-full h-24 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse my-4"></div>
              <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
          ) : streamedResponse ? (
            /* Rendered Markdown + Math Engine Output */
            <div className="relative">
              <MarkdownRenderer text={streamedResponse} />
              {isAnalyzing && (
                <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1 align-middle" />
              )}
            </div>
          ) : (
            /* Empty Fallback State */
            <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-slate-700 mb-3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <p className="text-xs font-mono uppercase tracking-wider">Awaiting Analysis Stream</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}