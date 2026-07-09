/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Snap Feature Master Layout.
 * 1. Synchronized Architecture: Mirrors the exact `lg:ml-64` dynamic grid scaling used in Dashboard and Tools to ensure zero layout shifting.
 * 2. Premium Scrollbars: Injects custom translucent WebKit scrollbars.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — SNAP TO ANSWER MASTER LAYOUT (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function SnapLayout({ children }) {
  // Syncs default state to true to match other dashboard pages
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      <style dangerouslySetInnerHTML={{__html: `
        .snap-premium-scroll::-webkit-scrollbar { width: 6px; }
        .snap-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .snap-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .snap-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
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

        <main className="flex-1 overflow-y-auto snap-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-0 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}