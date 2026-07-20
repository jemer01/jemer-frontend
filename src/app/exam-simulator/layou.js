"use client"; // Enforces client-side execution to enable React state hooks for interactive mobile layout toggles[cite: 5]

// Import core React state hook to track sidebar toggle state[cite: 5]
import React, { useState } from "react"; 

// Import global cached sidebar component without extension to avoid path parsing bugs[cite: 5]
import Sidebar from "@/jemer-components/layout/Sidebar"; 

// Import top header command navbar component without extension[cite: 5]
import Navbar from "@/jemer-components/layout/Navbar"; 

/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — EXAM SIMULATOR MASTER LAYOUT (v2.1)[cite: 5]
 * ================================================================================================
 * Master route layout handler for `/exam`.[cite: 5]
 * Controls full viewport lockdown, dynamic sidebar margin shifts, and top navbar state.[cite: 5]
 */
export default function ExamLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ────────────────────────────────────────────
  // Set to 'true' by default so it stays open when navigating and preserves the seamless SPA feel[cite: 5]
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    // Locks total viewport height, hides root scrollbars, and sets background themes[cite: 5]
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* Custom styled scrollbars for WebKit browsers[cite: 5] */}
      <style dangerouslySetInnerHTML={{__html: `
        .exam-premium-scroll::-webkit-scrollbar { width: 6px; }
        .exam-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .exam-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .exam-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP OVERLAY */}
      {/* Displays translucent backdrop when sidebar is open on small screens[cite: 5] */}
      {isSidebarVisible && (
        <div
          // Dismisses mobile sidebar when user clicks anywhere on the backdrop overlay[cite: 5]
          onClick={() => setIsSidebarVisible(false)}
          // Visual styling for mobile backdrop overlay layer[cite: 5]
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      {/* Renders global sidebar component and binds visibility state props[cite: 5] */}
      <Sidebar 
        // Pass open state flag boolean[cite: 5]
        isOpen={isSidebarVisible} 
        // Pass sidebar close handler callback function[cite: 5]
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      {/* Shifts main content left margin by 256px (lg:ml-64) when sidebar is open to fix layout overlap[cite: 5] */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        
        {/* TOP COMMAND RAIL NAVBAR */}
        {/* Renders top navigation bar and connects hamburger button to sidebar toggle[cite: 5] */}
        <Navbar 
          // Toggle sidebar state on hamburger menu click[cite: 5]
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        />

        {/* 📥 SELF-CONTAINED MAIN COMPONENT WORKSPACE CELL */}
        {/* Scrollable container for exam sub-routes[cite: 5] */}
        <main className="flex-1 overflow-y-auto exam-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          {/* Inner content wrapper with responsive padding[cite: 5] */}
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {/* Render child sub-pages dynamically[cite: 5] */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}