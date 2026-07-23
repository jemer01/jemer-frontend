/**
 * ================================================================================================
 * ⚙️ JEMER ACADEMY SETTINGS LAYOUT SHIELD (UPGRADED)
 * ================================================================================================
 * Description: Master layout coordinator for settings. Now perfectly matches dashboard widths
 * and includes a customized WebKit scrollbar implementation.
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import Sidebar from "@/jemer-components/layout/Sidebar.jsx";
import Navbar from "@/jemer-components/layout/Navbar.jsx";

export default function SettingsLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex relative transition-colors duration-200 font-sans">
      
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

        {/* 📥 SELF-CONTAINED SEGMENTED SCROLL CHANNEL WITH CUSTOM CSS SCROLLBAR */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 
          [&::-webkit-scrollbar]:w-2.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 
          [&::-webkit-scrollbar-thumb]:border-[2px] [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-slate-50 dark:[&::-webkit-scrollbar-thumb]:border-slate-950
          [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 transition-colors"
        >
          {/* MAX-W-7XL FIX: Aligns perfectly with dashboard, eliminating the broken right-side gap */}
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-fade-in w-full">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}