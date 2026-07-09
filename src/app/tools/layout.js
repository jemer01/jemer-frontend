/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 Layout Polish & Responsive Refactor.
 * 1. Dynamic Margins: Bound the `lg:ml-64` margin directly to `isSidebarVisible` so the page stretches perfectly when closed.
 * 2. Premium Scrollbars: Injected custom WebKit CSS to replace the ugly native HTML scrollbar.
 * 3. Bottom Clipping Fix: Adjusted flex properties and added padding to ensure the screen no longer cuts off the bottom elements.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — LEARNING TOOLS MASTER LAYOUT (v2.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow responsive React hooks for mobile states

import React, { useState } from "react"; // Pulls core state hooks from React
import Sidebar from "@/jemer-components/layout/Sidebar.jsx"; // Injects your global cache-hydrated sidebar
import Navbar from "@/jemer-components/layout/Navbar.jsx"; // Injects your responsive top command rail

/**
 * Global Learning Tools Workspace Route Layout Handler
 * @param {Object} props - Structural properties argument parameters.
 * @param {React.ReactNode} props.children - Nested child component layouts streaming through this route.
 */
export default function ToolsLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ────────────────────────────────────────────
  // Controls visibility parameters for the mobile/desktop side menu command rail.
  // Defaults to false so the user gets an immersive full-screen experience immediately.
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER BOX BOUNDARY
    // Forces absolute full-screen dimensions and clips content spills to guarantee solid frame layout symmetry.
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .tools-premium-scroll::-webkit-scrollbar { width: 6px; }
        .tools-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .tools-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .tools-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {/* Unmounts on desktop monitors to avoid layout lockout bugs. Captures clicks to close the mobile drawer. */}
      {isSidebarVisible && (
        <div
          onClick={() => {
            console.log("[TOOLS LAYOUT] Mobile backdrop click detected. Collapsing navigation drawer.");
            setIsSidebarVisible(false);
          }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      {/* Layered at z-40. Receives visibility state commands to slide completely off-screen when closed on mobile. */}
      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      {/* Dynamic Margin Engine: If sidebar is open, push 64 units right. If closed, snap to 0. 
          This completely eliminates the empty dead space bug. */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        
        {/* TOP COMMAND RAIL NAVBAR */}
        {/* Passes the visibility toggle callback to the hamburger menu icon */}
        <Navbar 
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        />

        {/* 📥 SELF-CONTAINED FIXED SEGMENTED MAIN COMPONENT CELL */}
        {/* Binds our new custom scrollbar class and overrides native body scrolling. */}
        <main className="flex-1 overflow-y-auto tools-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          
          {/* Inject dynamic feature contents safely. 
            Added pb-24 (Padding Bottom) to ensure mobile browser tabs don't cut off the bottom of the page!
          */}
          <div className="w-full h-full p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
            {children}
          </div>
          
        </main>
      </div>
    </div>
  );
}