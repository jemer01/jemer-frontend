/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 AI Results Output Matrix.
 * 1. Dynamic Image Rendering: Replaced the dummy placeholder with a functional `<img />` tag that perfectly renders the high-quality cropped base64 string passed down from the cropper.
 * 2. Premium Header Upgrade: Injected the Next.js-optimized `lucide-brain` SVG into the results header, housing it inside a premium blue/indigo gradient container with deep drop shadows.
 * 3. Elevated Output UI: Upgraded the solution container with heavy `shadow-2xl` drops, sleek borders, and an elegant typography layout that anticipates the AI's markdown/LaTeX rendering.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — SNAP RESULTS ENGINE (v2.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function SnapResults({ imageUrl, onReset, onChat }) {
  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
      
      {/* ── CAPTURED IMAGE PREVIEW ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-3 rounded-[2rem] shadow-md flex items-center justify-center">
         <div className="w-full h-48 sm:h-64 bg-slate-100 dark:bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Cropped problem capture" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <i className="fas fa-image text-4xl mb-2 opacity-50"></i>
                <span className="text-[10px] font-mono uppercase tracking-widest">No Image Data</span>
              </div>
            )}
         </div>
      </div>

      {/* ── PRIMARY ACTION ROUTING ── */}
      <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onReset} 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-4 px-6 rounded-2xl font-black uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 text-xs"
          >
              <i className="fas fa-camera text-blue-500 text-sm"></i>
              <span>Snap Another</span>
          </button>
          <button 
            onClick={onChat} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
          >
              <i className="fas fa-comments text-sm"></i>
              <span>Tutor Chat</span>
          </button>
      </div>

      {/* ── AI SOLUTION MATRIX CONTAINER ── */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] flex flex-col mb-8">
          
          {/* Header Bar */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center gap-4 shrink-0">
              
              {/* 🚀 UPGRADED: Next.js Optimized Lucide Brain SVG */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
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
                  AI Solution Engine
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mt-1.5">
                  Analysis Complete // Ready for Review
                </p>
              </div>
          </div>
          
          {/* Dummy Markdown/Content Body */}
          <div className="p-6 md:p-8 space-y-6 flex-1 bg-slate-50/50 dark:bg-slate-950/30">
              {/* Simulated UI Shimmer loading lines mimicking text layout */}
              <div className="space-y-3">
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-5/6 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
              
              {/* Dummy Code/Math Block */}
              <div className="w-full h-32 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center shadow-sm">
                 <i className="fas fa-square-root-alt text-3xl text-slate-300 dark:text-slate-700 mb-3"></i>
                 <span className="text-xs text-slate-400 font-mono tracking-wider">[ Markdown / LaTeX Render Frame ]</span>
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