// app/settings/layout.js
"use client";

/**
 * ================================================================================================
 * ⚙️ JEMER ACADEMY SETTINGS LAYOUT SHIELD (UPGRADED)
 * ================================================================================================
 * 🆕 NEW UPGRADES BUILT:
 * 1. Hydration Mismatch Fix: Removed the massive inline arbitrary Tailwind scrollbar classes 
 *    that were causing HTML string mismatches between the Server (SSR) and Client.
 * 2. Premium Scroll Injection: Replaced it with a safe `<style>` block and a clean 
 *    `.settings-premium-scroll` class, identical to the proven Exam Simulator architecture.
 * ================================================================================================
 */

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function SettingsLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex relative transition-colors duration-200 font-sans">
      
      {/* 🆕 CSS Injection for Webkit Scrollbar (Bypasses SSR Hydration crashes) */}
      <style dangerouslySetInnerHTML={{__html: `
        .settings-premium-scroll::-webkit-scrollbar { width: 10px; }
        .settings-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .settings-premium-scroll::-webkit-scrollbar-thumb { 
          background-color: #cbd5e1; 
          border-radius: 9999px; 
          border: 2px solid #f8fafc; 
        }
        .dark .settings-premium-scroll::-webkit-scrollbar-thumb { 
          background-color: #334155; 
          border-color: #020617; 
        }
        .settings-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        .dark .settings-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: #475569; }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {isSidebarVisible && (
        <div
          onClick={() => setIsSidebarVisible(false)}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-20 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      <div 
        className={`h-full flex flex-col w-full min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        
        {/* 📑 GLOBAL TOP ADMINISTRATIVE NAVBAR HEADER */}
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        {/* 📥 SELF-CONTAINED SEGMENTED SCROLL CHANNEL */}
        <main className="flex-1 overflow-y-auto settings-premium-scroll p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 transition-colors">
          {/* MAX-W-7XL FIX: Aligns perfectly with dashboard */}
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}