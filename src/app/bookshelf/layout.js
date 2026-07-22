/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — BOOKSHELF MASTER LAYOUT (v1.0)
 * ================================================================================================
 * SUMMARY: First-class layout wrapper for the digital library.
 * 1. Default State Sync: Initializes `isSidebarVisible` to `true` to maintain SPA consistency.
 * 2. Viewport Lockdown: Locks the outer container to `h-screen w-full overflow-hidden`.
 * 3. Premium Scrollbars: Injects custom CSS to keep the library visually pristine.
 */

"use client";

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function BookshelfLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ──
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars for the Library */}
      <style dangerouslySetInnerHTML={{__html: `
        .bookshelf-premium-scroll::-webkit-scrollbar { width: 6px; }
        .bookshelf-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .bookshelf-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .bookshelf-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
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
        <main className="flex-1 overflow-y-auto bookshelf-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}