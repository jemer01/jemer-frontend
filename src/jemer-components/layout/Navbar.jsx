/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — PREMIUM HIGH-CONTRAST NAVBAR CORE (v5.9 FUNCTIONAL)
 * ================================================================================================
 * new: Unified the navbar's background with the rest of the app (bg-slate-50 / dark:bg-slate-950,
 * matching layout.js's page background) instead of its previous bg-white / dark:bg-slate-900,
 * which read as a visibly lighter/bluer panel against the page in dark mode. The existing
 * border-b border-slate-200 dark:border-slate-800 divider was left untouched — now that the
 * navbar and page share the same background, that line reads as the boundary between them
 * instead of just the edge of a differently-shaded panel.
 * ================================================================================================
 * new: Removed visual container styling (borders, backgrounds, shadows, and rigid fixed dimensions) from all buttons, leaving clean standalone hover-responsive icons.
 * Description: High-visibility, responsive top control navigation asset for the application shell.
 * Smart Upgrade Layer: Dynamically injects specialized utility tools when routing on the tutor page.
 * Wiring Layer: Fully connected onCalculatorToggle callback to open the adaptive calculator engine.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Enforces client-side processing configurations to safely manage layout hooks and browser document nodes

import React from "react"; // Pulls core structural React modules to compile interface elements
import { usePathname } from "next/navigation"; // Pulls the official Next.js URL parser to dynamically track route changes


/**
 * Global Top Administrative Navbar Component
 * @param {Object} props - Structural property inputs assigned by parent orchestrator layout nodes.
 * @param {function} props.onMenuToggle - Execution callback action fired to invert main sidebar visibility vectors.
 * @param {function} props.onTutorSidebarToggle - Execution callback action fired to toggle the auxiliary tutor history sidebar panel.
 * @param {function} props.onCalculatorToggle - Execution callback action fired to toggle the adaptive math calculator modal sheet.
 */
export default function Navbar({ onMenuToggle, onTutorSidebarToggle, onCalculatorToggle }) {
  

  // Captures active web layout routes to dynamically identify if the student is currently sitting inside the tutor arena
  const activePathname = usePathname();

  // Evaluates route data fields to confirm if the user is explicitly viewing the tutor section
  const isCurrentlyOnTutorPage = activePathname === "/tutor";

  return (
    // ────────────────────────────────────────────────────────────────────────────────────────────
    // 🏢 MASTER HEADER OUTER WRAPPER CANVAS CONTAINER
    // ────────────────────────────────────────────────────────────────────────────────────────────
    // Rich, solid background color tokens (bg-slate-50 / dark:bg-slate-950) providing an opaque canvas foundation, matching the page background.
    <header className="sticky top-0 right-0 w-full h-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 transition-colors duration-200 select-none">
      
      {/* ── LEFT SECTION: UNIFIED GLOBAL HAMBURGER COMMAND NODE & CORE BRAND TEXT ── */}
      <div className="flex items-center gap-4">
        
        {/* ☰ CORE UNIFIED NAV TRIGGER NAVIGATION BUTTON */}
        {/* Container classes removed; acts as a clean standalone icon wrapper with padding for touch targets. */}
        <button
          type="button"
          id="jemer-header-hamburger-anchor"
          onClick={(clickEventContext) => {
            // Stop click propagation event tracks from bleeding outward to layout wrapper levels
            clickEventContext.stopPropagation();
            console.log("[NAVBAR ADMINISTRATIVE CORE] Hamburger toggle node clicked. Propagating visibility states upward...");
            onMenuToggle(); // Fires parent layout sidebar expansion modifiers
          }}
          className="text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 group p-2"
          title="Toggle Platform Navigation Command Rail"
        >
          {/* Minimalist modern vector menu track wire nodes */}
          <svg className="w-6 h-6 transition-transform duration-200 group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 👑 EXPLICIT PLATFORM COMPANY WRITE-UP ELEMENT */}
        {/* Deep solid slate-900 text in light mode and pure high-visibility white text in dark mode. */}
        <h1 className="font-display font-black tracking-wider uppercase text-sm sm:text-base text-slate-900 dark:text-white select-none">
          Jemer Academy
        </h1>
        
      </div>

      {/* ── RIGHT SECTION: DYNAMIC HARDWARE-ACCELERATED DESIGN THEME TOGGLE & SMART AUXILIARY TOOLS ── */}
      {/* Configured with a uniform flex layout gap-2 to align all newly injected controls fluidly */}
      <div className="flex items-center justify-end gap-2">
        
        {/* 🧠 SMART DYNAMIC PIPELINE INJECTION GATE */}
        {/* This block inspects routing configurations, revealing the tutor-specific options exclusively on the tutor view */}
        {isCurrentlyOnTutorPage && (
          <>
            {/* 1. 📜 DEDICATED TUTOR SIDE PANEL SIDEBAR BUTTON */}
            {/* Connected onTutorSidebarToggle handler callback method down to catch click actions fluidly */}
            <button
              type="button"
              onClick={(clickEventContext) => {
                // Stop click event propagation tracks from bleeding down to parent components
                clickEventContext.stopPropagation();
                console.log("[NAVBAR SMART CORE] Dedicated Tutor Chat History button clicked. Inverting visibility state...");
                if (onTutorSidebarToggle) onTutorSidebarToggle(); // Fire the functional state modifier callback
              }}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 relative group p-2"
              title="Open Dedicated Tutor Chat History Panel"
            >
              {/* Premium custom inline staggered panel toggle icon signifying sidebar layout layers */}
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              {/* Premium micro hover context labels layout */}
              <div className="absolute top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold font-mono rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none shadow-md z-50 whitespace-nowrap">
                Tutor History
              </div>
            </button>

            {/* 2. 📖 UNIVERSAL EDUCATIONAL DICTIONARY COMPONENT BUTTON */}
            {/* Built to scale cleanly, passing execution boundaries down to dictionary.jsx later */}
            <button
              type="button"
              onClick={() => {
                console.log("[NAVBAR SMART CORE] Dictionary auxiliary utility activated. Initializing future dictionary.jsx reference link...");
                alert("Dictionary utility triggered. This will activate your dictionary.jsx modal component.");
              }}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 relative group p-2"
              title="Open Academy Reference Dictionary"
            >
              {/* Clean custom inline vector icon showing a flat open workbook module asset */}
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {/* Premium micro hover context labels layout */}
              <div className="absolute top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold font-mono rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none shadow-md z-50 whitespace-nowrap">
                Open Dictionary
              </div>
            </button>

            {/* 3. 🧮 COMPLEX CURRICULUM MATHEMATICS CALCULATOR BUTTON */}
            {/* ⚡ WIRING OVERHAUL: Replaced placeholder alert structure with active onCalculatorToggle state propagation */}
            <button
              type="button"
              onClick={(clickEventContext) => {
                // Stop click event propagation tracks from bleeding down to parent components
                clickEventContext.stopPropagation();
                console.log("[NAVBAR SMART CORE] Calculator auxiliary utility button clicked. Triggering layout views state...");
                if (onCalculatorToggle) onCalculatorToggle(); // Fire the functional state modifier callback to open calculator view
              }}
              className="text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 relative group p-2"
              title="Open Scientific Math Calculator"
            >
              {/* Clean custom inline vector icon showing grid calculation cell rows */}
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {/* Premium micro hover context labels layout */}
              <div className="absolute top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold font-mono rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none shadow-md z-50 whitespace-nowrap">
                Math Calculator
              </div>
            </button>
          </>
        )}
        
        
        
      </div>
    </header>
  );
}