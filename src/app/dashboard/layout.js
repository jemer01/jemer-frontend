/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY DASHBOARD LAYOUT SHIELD — INTEGRATED SHELL ARCHITECTURE v5.2
 * ================================================================================================
 * Description: Master structural layout coordinator organizing components, sidebars, and headers.
 * Patch Notes: Hardened backdrop constraints with lg:hidden to completely prevent widescreen
 * content dimming and interaction lockouts on initial platform initialization.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * Location: Saved inside src/app/dashboard/layout.js
 * ================================================================================================
 */

"use client"; // Marks client state compilation capabilities to permit responsive hook evaluation tracks

import React, { useState } from "react"; // Imports core hooks to drive responsive state triggers

// Injects your freshly optimized, split-scrolling, brand-mapped global sidebar interface repository
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";

// Injects your brand new minimalist text-branded theme-capable navigation header navbar component
import Navbar from "@/jemer-components/layout/Navbar.jsx";

/**
 * Main Layout Coordinator Wrapper Module
 */
export default function DashboardLayout({ children }) {
  // 📡 UNIFIED GLOBAL SIDEBAR VISIBILITY VARIABLE STATE FLIPPER:
  // Controls the display bounds layout parameters for both mobile monitors and massive monitor frameworks.
  // - true: Side panel slides into visibility focus on left screen edges across all platforms.
  // - false: Side panel translates completely out of view, maximizing presentation fields for app pages.
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER BOX BOUNDARY:
    // Forces explicit full screen measurements and clips content spills to guarantee solid frame layout symmetry.
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex relative transition-colors duration-200 font-sans">
      
      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {/* FIXED: Added 'lg:hidden'. This guarantees the dimming layer completely unmounts on laptop 
          and widescreen monitors, resolving the initial-load dimming bug instantly. */}
      {isSidebarVisible && (
        <div
          onClick={() => {
            console.log("[LAYOUT BACKDROP CAPTURE] Click/Touch detected outside side panel workspace. Closing menu shell.");
            setIsSidebarVisible(false);
          }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-20 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR:
          Layered at z-40. Receives visibility state commands to slide completely off-screen when closed.
      */}
      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER:
          Transitions fluidly between open and closed modes. When the sidebar slides away, 
          this container moves to lg:ml-0, expanding to fill the entire screen beautifully.
      */}
      <div 
        className={`h-full flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        
        {/* 📑 GLOBAL TOP ADMINISTRATIVE NAVBAR HEADER:
            Remains pinned to the top of the content column, moving gracefully alongside the layout grid.
        */}
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        {/* 📥 SELF-CONTAINED SEGMENTED SCROLL CHANNEL */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 focus:outline-none bg-slate-50/40 dark:bg-slate-950/40">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            
            {/* Inject long-form dashboard feature contents list modules dynamically right inside the main body views */}
            {children}
            
          </div>
        </main>
        
      </div>
    </div>
  );
}