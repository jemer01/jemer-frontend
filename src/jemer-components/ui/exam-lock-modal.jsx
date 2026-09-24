"use client";

/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Standalone URL Interceptor & Dashboard Route Patch (v2.1)
 * 1. STANDALONE ROUTE DETECTION: Expanded the URL regex to catch standalone `/jamb`, `/waec`, and `/cbt` 
 *    URLs in addition to all `/exam/*` sub-paths, preventing users from bypassing the lock.
 * 2. DASHBOARD ESCAPE ROUTE: Updated the "Return to Dashboard" button link from `/` to `/dashboard`, 
 *    routing users straight into the internal dashboard rather than the public landing page.
 * 3. ROOT PORTAL VIEWPORT: Maintains `createPortal(..., document.body)` at `z-[99999]` to lock the entire screen.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — EXAM SIMULATOR SECURITY BARRIER
 * ================================================================================================
 */

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ExamLockModal({ forceShow = false }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🚀 FIXED: Catches standalone /jamb, /waec, /cbt, as well as /exam, /exams, /exam-simulator, etc.
  const isExamRoute = pathname
    ? /(^|\/)(exam|exams|exam-simulator|examsimulator|jamb|waec|cbt)(\/|$)/i.test(pathname)
    : false;

  // If forceShow is false AND the user is NOT on an exam/jamb URL, do not render anything
  if (!forceShow && !isExamRoute) {
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
      aria-labelledby="exam-lock-title"
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Calibration & Verification
        </div>

        {/* Feature Icon Header */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-inner">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        {/* Informational Hierarchy */}
        <div className="space-y-3 mb-8">
          <h2 id="exam-lock-title" className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Exam Simulator <br className="hidden sm:block" />
            <span className="text-emerald-600 dark:text-emerald-400">Under Active Development</span>
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            Our national CBT simulation engines (JAMB, WAEC, and AI Questions Hunter) are currently undergoing real-time question verification and server calibrations.
          </p>
        </div>

        {/* Feature Matrix Pillars */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-8 text-left">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Phase Status</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">Engine Testing</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Availability</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">Coming Soon</span>
          </div>
        </div>

        {/* 🚀 FIXED: Primary Action Control points directly to /dashboard */}
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