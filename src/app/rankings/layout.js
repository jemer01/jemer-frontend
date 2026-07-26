// app/rankings/layout.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - GLOBAL RANKINGS LAYOUT)
 * ================================================================================================
 * 1. MASTER WRAPPER: Dedicated layout for `/rankings` integrating smoothly into the Jemer ecosystem.
 * 2. PRESTIGE AMBER THEME: Custom `.ranking-premium-scroll` WebKit scrollbar tinted to a sleek 
 *    Gold/Amber (`rgba(245, 158, 11, 0.4)`) to signify the prestige of the global leaderboard.
 * 3. CORE UI PRESERVED: Retains fixed Sidebar, Navbar, and responsive mobile translucent backdrop 
 *    to ensure absolute consistency with other platform pages.
 * ================================================================================================
 */

import React, { useState } from "react"; 
import Sidebar from "@/jemer-components/layout/Sidebar"; 
import Navbar from "@/jemer-components/layout/Navbar"; 

export default function RankingsLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* Gold/Amber themed custom scrollbars for the rankings dashboard */}
      <style dangerouslySetInnerHTML={{__html: `
        .ranking-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .ranking-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .ranking-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(245, 158, 11, 0.3); border-radius: 10px; }
        .ranking-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(245, 158, 11, 0.6); }
      `}} />

      {isSidebarVisible && (
        <div
          onClick={() => setIsSidebarVisible(false)}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        <main className="flex-1 overflow-y-auto ranking-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}