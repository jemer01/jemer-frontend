// app/brain-training/layout.js
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - BRAIN TRAINING LAYOUT)
 * ================================================================================================
 * 1. MASTER WRAPPER: Dedicated layout for `/brain-training` matching the Jemer core architecture.
 * 2. CRIMSON/ROSE THEME: Custom `.brain-premium-scroll` WebKit scrollbar tinted to a vibrant 
 *    Rose/Crimson (`rgba(225, 29, 72, 0.4)`) to symbolize vitality and neural focus.
 * 3. CORE UI PRESERVED: Retains fixed Sidebar, Navbar, and responsive mobile translucent backdrop 
 *    to ensure absolute consistency across the platform.
 * ================================================================================================
 */

import React, { useState } from "react"; 
import Sidebar from "@/jemer-components/layout/Sidebar"; 
import Navbar from "@/jemer-components/layout/Navbar"; 

export default function BrainTrainingLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* Rose/Crimson themed custom scrollbars for the brain training dashboard */}
      <style dangerouslySetInnerHTML={{__html: `
        .brain-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .brain-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .brain-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(225, 29, 72, 0.3); border-radius: 10px; }
        .brain-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(225, 29, 72, 0.6); }
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

        <main className="flex-1 overflow-y-auto brain-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}