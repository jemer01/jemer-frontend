/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — JEMERPLAY MASTER LAYOUT
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow responsive React hooks for mobile states

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function JemerPlayLayout({ children }) {
  // ── NAVIGATION SIDEBAR VISIBILITY STATE ──
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Vertical Workspace Scrollbar */
        .tools-premium-scroll::-webkit-scrollbar { width: 6px; }
        .tools-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .tools-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .tools-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }

        /* Horizontal Video List Scrollbar */
        .horizontal-premium-scroll::-webkit-scrollbar { height: 6px; }
        .horizontal-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .horizontal-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(59,130,246,0.4); border-radius: 10px; }
        .horizontal-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(59,130,246,0.8); }
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

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        {/* 📥 SELF-CONTAINED MAIN COMPONENT CELL */}
        <main className="flex-1 overflow-y-auto tools-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}