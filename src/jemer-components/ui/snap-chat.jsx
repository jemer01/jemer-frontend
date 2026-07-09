/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Localized Contextual Chat UI.
 * 1. Navigation Flow: Houses a 'Back to Solution' header to seamlessly exit stage 3.
 * 2. Visual Polish: Uses glassmorphism chat bubbles and a fixed prompt box mirroring your main AI tutor interface.
 * ================================================================================================
 * 💬 JEMER ACADEMY DESIGN SYSTEM — SNAP CHAT ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function SnapChat({ onBack }) {
  return (
    <div className="w-full flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 shrink-0">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95">
              <i className="fas fa-arrow-left"></i>
          </button>
          <h3 className="font-black text-slate-800 dark:text-white tracking-tight text-lg">Tutor Chat</h3>
      </div>
      
      {/* Message Area Mock */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
         <div className="flex justify-start">
            <div className="max-w-[80%] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 dark:text-slate-200 shadow-sm font-medium">
               Hi! I just solved this equation for you. Do you have any follow-up questions about the steps I took?
            </div>
         </div>
      </div>
      
      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="relative w-full max-w-4xl mx-auto">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 flex items-center shadow-inner">
                  <input type="text" placeholder="Ask a follow-up..." className="w-full bg-transparent border-none focus:outline-none focus:ring-0 p-2 text-sm text-slate-800 dark:text-white font-medium placeholder-slate-400" />
                  <button className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center active:scale-95 ml-2">
                      <i className="fas fa-arrow-up"></i>
                  </button>
              </div>
          </div>
      </div>

    </div>
  );
}