"use client"; // Enforces client-side execution in Next.js for interactive routing, hover animations, and touch events

// Import React core library
import React from "react"; 

// Import Next.js Link component for instant client-side route navigation without full-page reloads
import Link from "next/link"; 

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.2 - FINAL REFINEMENT)
 * ================================================================================================
 * 1. FULL CONTAINER BACKGROUND LOGOS: JAMB and WAEC logos now span the entire container width and 
 *    height as rich, full-bleed background artwork using absolute inset positioning and object-cover fit.
 * 2. WCAG HIGH-CONTRAST GRADIENT SCRIM: Embedded multi-stop backdrop overlays over the full background
 *    images. This ensures that the official logos are clearly visible as atmospheric background branding, 
 *    while all typography, badges, and buttons maintain top-tier readability in both Light and Dark modes.
 * 3. DYNAMIC HOVER SCALE ANIMATIONS: Added responsive scale physics (`group-hover:scale-110`) to background
 *    images for dynamic visual depth when users hover or tap on the cards.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — EXAM GATEWAY INTERACTIVE MATRIX
 * ================================================================================================
 * Master widget grid showcasing all 6 exam preparation pathways:
 * 1. JAMB CBT Practice (/jamb)
 * 2. WAEC Exam Simulation (/waec)
 * 3. Exam Practice (/exam-practice)
 * 4. Study-Room (/study)
 * 5. Questions Hunter (/questions)
 * 6. Performance History (/exam-performance)
 */
export default function ExamsWidget() {
  return (
    // 🏛️ MASTER GRID MATRIX CONTAINER: Fully responsive grid with adaptive mobile-to-desktop gaps
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6 w-full pb-8">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 1: JAMB CBT PRACTICE (/jamb)
          Flagship National Exam Placement — Spans 6 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for JAMB CBT exam center
        href="/jamb"
        // Outer Container Styling: Relative position anchor for full-bleed background layers
        className="group relative col-span-1 md:col-span-1 lg:col-span-6 min-h-[260px] sm:min-h-[280px] rounded-2xl sm:rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl dark:shadow-none dark:hover:border-slate-700 active:scale-[0.97] sm:active:scale-[0.98] cursor-pointer ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {/* 🆕 FULL CONTAINER BACKGROUND LOGO LAYER: JAMB Image spanning full background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Background Image Element */}
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPfrNqFCZsnoK0pZtjpwhI1NGpV6prZw5C7Mq2pDa38GGFXkYF009BpX8&s=10" 
            alt="JAMB Official Full Background" 
            className="w-full h-full object-cover object-center opacity-25 dark:opacity-30 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply dark:mix-blend-luminosity filter saturate-150 dark:saturate-100"
          />
          {/* Multi-stop Gradient Scrim for 100% Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/85 to-white/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900/50" />
        </div>

        {/* Ambient Emerald Glow Accent */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none z-0" />

        {/* Card Header Content Stack (Layered above full background) */}
        <div className="z-10 relative flex flex-col items-start gap-3.5 sm:gap-4">
          
          {/* Top Category Badge Icon */}
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/80 dark:ring-slate-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Typography Header Container */}
          <div className="space-y-1.5 w-full">
            {/* Title & Badge Flex Container */}
            <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
              {/* Main Card Title */}
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                JAMB <span className="text-emerald-600 dark:text-emerald-400">CBT</span>
              </h3>
              {/* Official Standard Status Pill */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80 backdrop-blur-md">
                Official Standard
              </span>
            </div>
            {/* Card Description Text */}
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed max-w-[95%]">
              Full UTME CBT simulation. Practice real exam timing, multiple subject combinations, and instant automatic score calculation.
            </p>
          </div>
        </div>

        {/* Interactive Bottom Touch & Action Bar */}
        <div className="z-10 relative flex items-center justify-between pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-slate-300/80 dark:border-slate-800">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform duration-300">
            Launch Simulation →
          </span>
          {/* Action Circle Button */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 2: WAEC EXAM SIMULATION (/waec)
          National Exam Placement — Spans 6 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for WAEC exam center
        href="/waec"
        // Outer Container Styling: Relative position anchor for full-bleed background layers
        className="group relative col-span-1 md:col-span-1 lg:col-span-6 min-h-[260px] sm:min-h-[280px] rounded-2xl sm:rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl dark:shadow-none dark:hover:border-slate-700 active:scale-[0.97] sm:active:scale-[0.98] cursor-pointer ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {/* 🆕 FULL CONTAINER BACKGROUND LOGO LAYER: WAEC Image spanning full background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Background Image Element */}
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFqoD3LP_NIy48sbFMJQBhFEbom6HDRIcjaxocOkjUlAEvKp05foqS2DKq&s=10" 
            alt="WAEC Official Full Background" 
            className="w-full h-full object-cover object-center opacity-25 dark:opacity-30 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply dark:mix-blend-luminosity filter saturate-150 dark:saturate-100"
          />
          {/* Multi-stop Gradient Scrim for 100% Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white via-white/85 to-white/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900/50" />
        </div>

        {/* Ambient Blue Glow Accent */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/15 dark:bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none z-0" />

        {/* Card Header Content Stack (Layered above full background) */}
        <div className="z-10 relative flex flex-col items-start gap-3.5 sm:gap-4">
          
          {/* Top Category Badge Icon */}
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/80 dark:ring-slate-800">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          
          {/* Typography Header Container */}
          <div className="space-y-1.5 w-full">
            {/* Title & Badge Flex Container */}
            <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
              {/* Main Card Title */}
              <h3 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                WAEC <span className="text-blue-600 dark:text-blue-400">Simulation</span>
              </h3>
              {/* WASSCE Level Status Pill */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-blue-100/90 dark:bg-blue-950/90 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800/80 backdrop-blur-md">
                WASSCE Level
              </span>
            </div>
            {/* Card Description Text */}
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed max-w-[95%]">
              Master theory structure and objective test dynamics for senior secondary certificate examinations with verified past questions.
            </p>
          </div>
        </div>

        {/* Interactive Bottom Touch & Action Bar */}
        <div className="z-10 relative flex items-center justify-between pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-slate-300/80 dark:border-slate-800">
          <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
            Start WAEC Practice →
          </span>
          {/* Action Circle Button */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 3: EXAM PRACTICE (/exam-practice)
          Single Subject Rapid Drills — Spans 4 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for Single Exam Practice drills
        href="/exam-practice"
        // Container Styling
        className="group relative col-span-1 md:col-span-1 lg:col-span-4 min-h-[230px] sm:min-h-[250px] rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-none dark:hover:border-slate-700 active:scale-[0.97] sm:active:scale-[0.98] cursor-pointer ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {/* Soft Ambient Amber Orb */}
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none" />

        {/* Card Content Stack */}
        <div className="z-10 flex flex-col items-start gap-3 sm:gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Exam <span className="text-amber-500">Practice</span>
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Target a single subject at a time with flexible question counts and timed test modes.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="z-10 flex items-center justify-between pt-3.5 sm:pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Single Drills
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white transition-all duration-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 4: STUDY-ROOM (/study)
          AI Instant Explanations & Untimed Learning — Spans 4 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for AI Study Room
        href="/study"
        // Container Styling
        className="group relative col-span-1 md:col-span-1 lg:col-span-4 min-h-[230px] sm:min-h-[250px] rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-none dark:hover:border-slate-700 active:scale-[0.97] sm:active:scale-[0.98] cursor-pointer ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {/* Soft Ambient Purple Orb */}
        <div className="absolute -top-20 -left-20 w-56 h-56 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none" />

        {/* Card Content Stack */}
        <div className="z-10 flex flex-col items-start gap-3 sm:gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Study-<span className="text-purple-500">Room</span>
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant AI explanations. No timer pressure. Learn step-by-step logic for every single solution.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="z-10 flex items-center justify-between pt-3.5 sm:pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
            AI Tutor Mode
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 5: QUESTIONS HUNTER (/questions)
          Search Engine for Exam Questions — Spans 4 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for Questions Search Engine
        href="/questions"
        // Container Styling
        className="group relative col-span-1 md:col-span-1 lg:col-span-4 min-h-[230px] sm:min-h-[250px] rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-white to-slate-50/80 dark:from-slate-900 dark:to-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl dark:shadow-none dark:hover:border-slate-700 active:scale-[0.97] sm:active:scale-[0.98] cursor-pointer ring-1 ring-slate-900/5 dark:ring-white/10"
      >
        {/* Soft Ambient Cyan Orb */}
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl group-hover:scale-125 transition-all duration-700 pointer-events-none" />

        {/* Card Content Stack */}
        <div className="z-10 flex flex-col items-start gap-3 sm:gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
              Questions <span className="text-cyan-500">Hunter</span>
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              Find specific past questions on any topic you can imagine across JAMB, WAEC, and NECO.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="z-10 flex items-center justify-between pt-3.5 sm:pt-4 mt-2 border-t border-slate-200/80 dark:border-slate-800">
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Topic Search
          </span>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:text-white transition-all duration-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </Link>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CARD 6: PERFORMANCE HISTORY (/exam-performance)
          Analytics & Progress Dashboard Card — Full width 12 columns on large screens
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <Link 
        // Route destination for Performance Dashboard
        href="/exam-performance"
        // Banner layout styling
        className="group relative col-span-1 md:col-span-2 lg:col-span-12 min-h-[150px] sm:min-h-[160px] rounded-2xl sm:rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-[0.98] cursor-pointer ring-1 ring-white/10 dark:ring-white/15"
      >
        {/* Multi-color Ambient Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 rounded-full blur-2xl group-hover:scale-110 transition-all duration-700 pointer-events-none" />

        {/* Banner Left Content */}
        <div className="z-10 flex items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight text-white">
                Performance <span className="text-indigo-400">History</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Analytics
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-xl leading-relaxed">
              Review test logs, track subject mastery over time, and evaluate detailed score reports across all completed exam sessions.
            </p>
          </div>
        </div>

        {/* Action Button Callout */}
        <div className="z-10 mt-5 md:mt-0 w-full md:w-auto flex items-center justify-center md:justify-start gap-3 px-5 py-2.5 sm:px-6 sm:py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl sm:rounded-2xl text-xs font-black uppercase tracking-wider text-white transition-all duration-300">
          <span>View Progress Report</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </Link>

    </div>
  );
}