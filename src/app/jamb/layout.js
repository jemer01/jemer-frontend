// app/jamb/layout.js
"use client"; // Enforces client-side execution to enable React state hooks for interactive mobile layout toggles

/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Standalone JAMB Route Lockdown (v2.2)
 * 1. DEVELOPMENT LOCK MOUNT: Injected `<ExamLockModal forceShow={true} />` directly into `/jamb` layout. 
 *    Typing `/jamb` directly in the URL now immediately triggers the uncloseable modal.
 * ================================================================================================
 */

// Import core React state hook to track sidebar toggle state
import React, { useState } from "react"; 

// Import global cached sidebar component using absolute path `@/jemer-components/layout/Sidebar`
import Sidebar from "@/jemer-components/layout/Sidebar"; 

// Import top header command navbar component using absolute path `@/jemer-components/layout/Navbar`
import Navbar from "@/jemer-components/layout/Navbar"; 

// 🚀 NEW: Import Lock Modal
import ExamLockModal from "@/jemer-components/ui/exam-lock-modal";

export default function JambLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 NEW: Universal Development Lock Overlay */}
      <ExamLockModal forceShow={true} />

      {/* Custom styled scrollbars for WebKit browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .exam-premium-scroll::-webkit-scrollbar { width: 6px; }
        .exam-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .exam-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
        .exam-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP OVERLAY */}
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
        <Navbar 
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        />

        <main className="flex-1 overflow-y-auto exam-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}