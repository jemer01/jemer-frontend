"use client";

/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Digital Library Viewport Maintenance & Development Lock Modal (v1.0)
 * 1. UNBREAKABLE VIEWPORT LOCK: Enforces `fixed inset-0 z-[99999] overflow-hidden overscroll-none touch-none` 
 *    with an opaque backdrop blur (`backdrop-blur-xl bg-slate-950/85`) mounted directly to `document.body`.
 * 2. DYNAMIC ROUTE SNIFFER: Uses `usePathname()` from `next/navigation` to detect `/bookshelf`, `/library`, 
 *    or any sub-path automatically, or can be forced via `forceShow={true}`.
 * 3. NON-DISMISSIBLE ARCHITECTURE: Zero close buttons, no backdrop click escapes, and no ESC key bypasses.
 * 4. CONTROLLED ESCAPE ROUTE: Features a dedicated "Return to Dashboard" button linking straight to `/dashboard`.
 * 5. MANIFESTO COMPLIANT: Styled with solid high-contrast Blue/Slate surface tokens matching the Bookshelf palette.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — DIGITAL LIBRARY DEVELOPMENT LOCK
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BookshelfLockModal({ forceShow = false }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 Sniffs if the current active URL belongs to the Bookshelf or Library section
  const isBookshelfRoute = pathname
    ? /(^|\/)(bookshelf|library|books)(\/|$)/i.test(pathname)
    : false;

  // If forceShow is false AND the user is NOT on a bookshelf URL, do not render anything
  if (!forceShow && !isBookshelfRoute) {
    return null;
  }

  // Prevent SSR hydration mismatch for portal
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    // 📡 MASTER VIEWPORT BOUNDARY: Highest z-index, non-scrollable, blocks all pointer and touch interactions below
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="bookshelf-lock-title"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-hidden overscroll-none touch-none select-none animate-fade-in"
    >
      {/* 🚀 CSS ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes lockScaleEnter {
          0% { opacity: 0; transform: scale(0.96) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-lock-modal {
          animation: lockScaleEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      {/* 🏛️ MASTER LOCK CARD */}
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 sm:p-8 lg:p-10 flex flex-col items-center text-center relative animate-lock-modal"
        onClick={(e) => e.stopPropagation()} // Prevents accidental click delegation
      >
        {/* Top Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Active Curation & Digitization
        </div>

        {/* Feature Icon Header: Book / Library Primitive */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        {/* Informational Hierarchy */}
        <div className="space-y-3 mb-8">
          <h2 id="bookshelf-lock-title" className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Digital Library <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">Under Active Curation</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Our curated academic knowledge space, interactive textbook reader, and syllabus guides are currently undergoing cataloging and digitizing calibrations.
          </p>
        </div>

        {/* Feature Matrix Pillars */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-8 text-left">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Catalog Status</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">Indexing Texts</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Availability</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 block truncate">Coming Soon</span>
          </div>
        </div>

        {/* Primary Action Control: Escape to Dashboard */}
        <div className="w-full">
          <Link
            href="/dashboard"
            className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}