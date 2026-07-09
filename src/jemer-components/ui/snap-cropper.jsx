/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Production-Ready Cropper UI.
 * 1. Action Grid: Rebuilt the Solve, Analyze, and Grade buttons with intense gradients, icons, and hover opacities.
 * 2. Visual Mock: Uses a CSS-driven bounding box to simulate a real cropper instance until backend integration.
 * ================================================================================================
 * ✂️ JEMER ACADEMY DESIGN SYSTEM — SNAP CROPPER (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function SnapCropper({ imageSource, onAction, onCancel }) {
  return (
    <div className="w-full flex flex-col h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
      
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider font-mono">Adjust Frame</span>
        <button onClick={onCancel} className="text-slate-900 dark:text-white font-bold text-sm hover:text-blue-500 transition-colors">Cancel</button>
      </div>

      {/* Cropper Viewport Mock */}
      <div className="flex-1 bg-slate-100 dark:bg-black/40 relative flex items-center justify-center overflow-hidden p-6">
        <div className="relative w-full max-w-sm aspect-[3/4] bg-slate-300 dark:bg-slate-800 rounded-lg shadow-inner">
           {/* Mock Selection Box */}
           <div className="absolute inset-10 border-2 border-white bg-blue-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="w-4 h-4 bg-white border border-slate-300 absolute -top-2 -left-2 rounded-full cursor-nwse-resize" />
              <div className="w-4 h-4 bg-white border border-slate-300 absolute -top-2 -right-2 rounded-full cursor-nesw-resize" />
              <div className="w-4 h-4 bg-white border border-slate-300 absolute -bottom-2 -left-2 rounded-full cursor-nesw-resize" />
              <div className="w-4 h-4 bg-white border border-slate-300 absolute -bottom-2 -right-2 rounded-full cursor-nwse-resize" />
           </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onAction(imageSource, 'solve')} className="group bg-gradient-to-b from-blue-500 to-blue-700 text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-lg shadow-blue-500/30">
              <i className="fas fa-brain text-2xl mb-1 drop-shadow-md"></i>
              <span className="text-sm font-black tracking-wide">Solve</span>
              <span className="text-[10px] text-blue-100 font-medium leading-tight opacity-90">Step-by-step</span>
          </button>
          
          <button onClick={() => onAction(imageSource, 'analyze')} className="group bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border border-slate-200 dark:border-slate-700">
              <i className="fas fa-microscope text-2xl text-teal-500 mb-1"></i>
              <span className="text-sm font-black tracking-wide">Analyze</span>
              <span className="text-[10px] text-slate-500 opacity-60 font-medium leading-tight group-hover:opacity-100 transition-opacity">Deep dive</span>
          </button>
          
          <button onClick={() => onAction(imageSource, 'grade')} className="group bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border border-slate-200 dark:border-slate-700">
              <i className="fas fa-marker text-2xl text-pink-500 mb-1"></i>
              <span className="text-sm font-black tracking-wide">Grade</span>
              <span className="text-[10px] text-slate-500 opacity-60 font-medium leading-tight group-hover:opacity-100 transition-opacity">Mark & Fix</span>
          </button>
        </div>
      </div>

    </div>
  );
}