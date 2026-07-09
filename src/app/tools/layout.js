/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.1 Layout Sidebar Sync Fix.
 * 1. Default State Sync: Changed `useState(false)` to `useState(true)` for `isSidebarVisible`. 
 * This ensures the sidebar stays open when navigating from Dashboard -> Tools, preserving the seamless SPA feel.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — LEARNING TOOLS MASTER LAYOUT (v2.1)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow responsive React hooks for mobile states

import React, { useState } from "react"; // Pulls core state hooks from React
import Sidebar from "@/jemer-components/layout/Sidebar.jsx"; // Injects your global cache-hydrated sidebar
import Navbar from "@/jemer-components/layout/Navbar.jsx"; // Injects your responsive top command rail

/**
 * Global Learning Tools Workspace Route Layout Handler
 */
export default function ToolsLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ────────────────────────────────────────────
  // [UPGRADE FIXED]: Set to 'true' by default so it matches the dashboard and doesn't auto-close!
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER BOX BOUNDARY
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .tools-premium-scroll::-webkit-scrollbar { width: 6px; }
        .tools-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .tools-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .tools-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
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
        <Navbar 
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        />

        {/* 📥 SELF-CONTAINED FIXED SEGMENTED MAIN COMPONENT CELL */}
        <main className="flex-1 overflow-y-auto tools-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}