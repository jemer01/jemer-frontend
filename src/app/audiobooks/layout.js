/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Audiobooks Master Layout.
 * 1. Synchronized Architecture: Mirrors the exact `lg:ml-64` dynamic grid scaling used in Dashboard, Tools, and Snap to ensure absolute zero layout shifting when users navigate here.
 * 2. Premium Scrollbars: Injects custom translucent WebKit scrollbars specific to the audio workspace.
 * 3. Default State Sync: Initializes `isSidebarVisible` to `true` to maintain the seamless SPA feel established in previous upgrades.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — AUDIOBOOKS MASTER LAYOUT (v1.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow responsive React hooks for mobile states

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function AudioBooksLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ──
  // Syncs default state to true to perfectly match the dashboard and prevent auto-closing
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .audio-premium-scroll::-webkit-scrollbar { width: 6px; }
        .audio-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .audio-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .audio-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {isSidebarVisible && (
        <div
          onClick={() => setIsSidebarVisible(false)}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* TOP COMMAND RAIL NAVBAR */}
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        {/* 📥 SELF-CONTAINED FIXED SEGMENTED MAIN COMPONENT CELL */}
        <main className="flex-1 overflow-y-auto audio-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          {/* Note: Padding is completely removed here because you explicitly requested the Audio Record component to be edge-to-edge. */}
          <div className="w-full h-full pb-24 lg:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}