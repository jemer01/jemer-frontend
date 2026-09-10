/**
 * [NEW UPGRADE]
 * SUMMARY: v6.0 Manifesto Navbar UI/UX Refactor & Container Cleanse
 * 1. Mini Container Removal: Stripped out boxed backgrounds, borders, and rounded card containers (`w-10 h-10 rounded-xl border bg-slate-100`) from all header control items (hamburger menu, tutor history panel, reference dictionary, and math calculator). All buttons are now cleanly integrated directly into the header nav stream as pure visible interactive icon triggers.
 * 2. Spatial & Touch Optimization: Maintained accessible touch targets and active scale feedback while embracing clean minimalism.
 * 3. Logic Preservation: 100% preservation of all route detection hooks (`usePathname`), callback execution handlers (`onMenuToggle`, `onTutorSidebarToggle`, `onCalculatorToggle`), and state bindings.
 * ================================================================================================
 * 🚀 JEMER ACADEMY STARTUP ECOSYSTEM — HIGH-CONTRAST NAVBAR CORE (v6.0)
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
    <header className="sticky top-0 right-0 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 transition-colors duration-200 select-none">
      
      {/* ── LEFT SECTION: UNIFIED GLOBAL HAMBURGER COMMAND NODE & CORE BRAND TEXT ── */}
      <div className="flex items-center gap-4">
        
        {/* ☰ CORE UNIFIED NAV TRIGGER NAVIGATION BUTTON (Container removed, pure visible interactive icon) */}
        <button
          type="button"
          id="jemer-header-hamburger-anchor"
          onClick={(clickEventContext) => {
            clickEventContext.stopPropagation();
            console.log("[NAVBAR ADMINISTRATIVE CORE] Hamburger toggle node clicked. Propagating visibility states upward...");
            onMenuToggle(); 
          }}
          className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-95 group flex items-center justify-center"
          title="Toggle Platform Navigation Command Rail"
        >
          <svg className="w-6 h-6 transition-transform duration-200 group-active:scale-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 👑 EXPLICIT PLATFORM COMPANY WRITE-UP ELEMENT */}
        <h1 className="font-display font-black tracking-wider uppercase text-sm sm:text-base text-slate-900 dark:text-white select-none">
          Jemer Academy
        </h1>
        
      </div>

      {/* ── RIGHT SECTION: DYNAMIC SMART AUXILIARY TOOLS (Mini containers removed for flat visual clarity) ── */}
      <div className="flex items-center justify-end gap-3 sm:gap-4">
        
        {/* 🧠 SMART DYNAMIC PIPELINE INJECTION GATE */}
        {isCurrentlyOnTutorPage && (
          <>
            {/* 1. 📜 DEDICATED TUTOR SIDE PANEL SIDEBAR BUTTON */}
            <button
              type="button"
              onClick={(clickEventContext) => {
                clickEventContext.stopPropagation();
                console.log("[NAVBAR SMART CORE] Dedicated Tutor Chat History button clicked. Inverting visibility state...");
                if (onTutorSidebarToggle) onTutorSidebarToggle(); 
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-95 relative group flex items-center justify-center"
              title="Open Dedicated Tutor Chat History Panel"
            >
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
              <div className="absolute top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold font-mono rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none shadow-md z-50 whitespace-nowrap">
                Tutor History
              </div>
            </button>

            {/* 2. 📖 UNIVERSAL EDUCATIONAL DICTIONARY COMPONENT BUTTON */}
            <button
              type="button"
              onClick={() => {
                console.log("[NAVBAR SMART CORE] Dictionary auxiliary utility activated.");
                alert("Dictionary utility triggered. This will activate your dictionary.jsx modal component.");
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-95 relative group flex items-center justify-center"
              title="Open Academy Reference Dictionary"
            >
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="absolute top-full mt-2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[9px] font-bold font-mono rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 pointer-events-none shadow-md z-50 whitespace-nowrap">
                Open Dictionary
              </div>
            </button>

            {/* 3. 🧮 COMPLEX CURRICULUM MATHEMATICS CALCULATOR BUTTON */}
            <button
              type="button"
              onClick={(clickEventContext) => {
                clickEventContext.stopPropagation();
                console.log("[NAVBAR SMART CORE] Calculator auxiliary utility button clicked.");
                if (onCalculatorToggle) onCalculatorToggle(); 
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors duration-150 cursor-pointer active:scale-95 relative group flex items-center justify-center"
              title="Open Scientific Math Calculator"
            >
              <svg className="w-5 h-5 transition-transform duration-150 group-hover:scale-105" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
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