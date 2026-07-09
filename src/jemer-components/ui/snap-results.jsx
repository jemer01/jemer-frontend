/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 AI Results Output Matrix.
 * 1. Unified Layout: Matches legacy layout but upgraded with Apple-tier shadows, borders, and typography.
 * 2. Component Handoff: Triggers 'Snap Another' (reset) or 'Chat AI' (transitions to stage 3).
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — SNAP RESULTS (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function SnapResults({ imageUrl, onReset, onChat }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in p-4 sm:p-0">
      
      {/* Captured Image Preview */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-3xl shadow-sm flex items-center justify-center">
         <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
            <i className="fas fa-image text-4xl text-slate-400 opacity-50"></i>
         </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
          <button onClick={onReset} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3.5 px-6 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-xs sm:text-sm">
              <i className="fas fa-camera text-blue-500"></i>
              <span>Snap Another</span>
          </button>
          <button onClick={onChat} className="bg-blue-600 text-white py-3.5 px-6 rounded-2xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 text-xs sm:text-sm">
              <i className="fas fa-comments"></i>
              <span>Chat AI</span>
          </button>
      </div>

      {/* Solution Matrix Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[300px]">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-sparkles text-sm"></i>
              </div>
              <h2 className="font-black text-slate-800 dark:text-white text-lg tracking-tight">Solution</h2>
          </div>
          <div className="p-6 md:p-8 space-y-4">
              <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
              <div className="w-full h-24 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl mt-6 flex items-center justify-center text-xs text-slate-400 font-mono">
                 [Markdown / LaTeX Render Output]
              </div>
          </div>
      </div>

    </div>
  );
}