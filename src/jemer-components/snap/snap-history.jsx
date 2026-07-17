/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Snap History Carousel.
 * 1. UI Strategy: Horizontal scrolling (`overflow-x-auto`) container displaying cached visual data.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — SNAP HISTORY (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function SnapHistory() {
  const dummyHistory = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
      {dummyHistory.map((item) => (
        <div key={item} className="min-w-[140px] w-[140px] h-[180px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0 cursor-pointer relative transition-transform hover:-translate-y-1 hover:shadow-md group">
          <div className="w-full h-2/3 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
             <i className="fas fa-square-root-alt text-2xl text-slate-300 dark:text-slate-600"></i>
          </div>
          <div className="p-3 text-xs text-slate-600 dark:text-slate-300 font-medium truncate border-t border-slate-100 dark:border-slate-800">
            Solved Equation {item}
          </div>
        </div>
      ))}
    </div>
  );
}