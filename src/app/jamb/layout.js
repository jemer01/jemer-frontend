"use client"; // Enforces client-side execution to enable React state hooks for interactive mobile layout toggles

/**
 * ================================================================================================
 * 🆕 UPGRADES & CHANGES SUMMARY:
 * 1. INTEGRATED GLOBAL SIDEBAR & NAVBAR: Re-added the global master layout wrapper using 
 *    `@/jemer-components/layout/Sidebar` and `@/jemer-components/layout/Navbar`.
 * 2. HAMBURGER MENU CONTROL: Linked top navbar hamburger button (`onMenuToggle`) directly to 
 *    sidebar toggle state (`isSidebarVisible`).
 * 3. TRANSLUCENT BACKDROP OVERLAY: Added mobile-friendly click-to-dismiss overlay (`lg:hidden`).
 * 4. DYNAMIC MARGIN ADJUSTMENT: Smooth margin transition (`lg:ml-64` vs `ml-0`) to prevent sidebar content overlap.
 * 5. CUSTOM WEBKIT SCROLLBARS: Embedded `.exam-premium-scroll` styling for sleek custom scrolling across viewports.
 * ================================================================================================
 */

// Import core React state hook to track sidebar toggle state
import React, { useState } from "react"; 

// Import global cached sidebar component using absolute path `@/jemer-components/layout/Sidebar`
import Sidebar from "@/jemer-components/layout/Sidebar"; 

// Import top header command navbar component using absolute path `@/jemer-components/layout/Navbar`
import Navbar from "@/jemer-components/layout/Navbar"; 

/**
 * Master route layout handler for `/jamb`.
 * Controls full viewport lockdown, dynamic sidebar margin shifts, and top navbar state.
 */
export default function JambLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ────────────────────────────────────────────
  // Set to 'true' by default on desktop so it stays open when navigating and preserves SPA feel
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    // Locks total viewport height, hides root scrollbars, and sets background themes
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* Custom styled scrollbars for WebKit browsers */}
      <style dangerouslySetInnerHTML={{__html: `
        .exam-premium-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .exam-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .exam-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.3); border-radius: 10px; }
        .exam-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP OVERLAY */}
      {/* Displays translucent backdrop when sidebar is open on small screens */}
      {isSidebarVisible && (
        <div
          // Dismisses mobile sidebar when user clicks anywhere on the backdrop overlay
          onClick={() => setIsSidebarVisible(false)}
          // Visual styling for mobile backdrop overlay layer
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      {/* Renders global sidebar component and binds visibility state props */}
      <Sidebar 
        // Pass open state flag boolean
        isOpen={isSidebarVisible} 
        // Pass sidebar close handler callback function
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      {/* Shifts main content left margin by 256px (lg:ml-64) when sidebar is open to fix layout overlap */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        
        {/* TOP COMMAND RAIL NAVBAR */}
        {/* Renders top navigation bar and connects hamburger button to sidebar toggle */}
        <Navbar 
          // Toggle sidebar state on hamburger menu click
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        />

        {/* 📥 SELF-CONTAINED MAIN COMPONENT WORKSPACE CELL */}
        {/* Scrollable container for exam sub-routes */}
        <main className="flex-1 overflow-y-auto exam-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          {/* Inner content wrapper with responsive padding */}
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {/* Render child sub-pages dynamically */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}