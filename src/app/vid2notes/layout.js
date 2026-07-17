/**
 * [NEW BUILD] - JEMER ACADEMY VID2NOTES MASTER LAYOUT (v1.0)
 * SUMMARY: Executed v1.0 Vid2Notes Master Layout - 1000% Clone of Audiobooks.
 * 1. Synchronized Architecture: Mirrors exact `lg:ml-64` dynamic grid scaling used in Dashboard, Tools, Snap and Audiobooks to ensure absolute zero layout shifting.
 * 2. Fixed Controlled Visibility: Sidebar and Header are fixed and controlled via isSidebarVisible state, default true to maintain seamless SPA feel.
 * 3. Premium Scrollbars: Injects custom translucent WebKit scrollbars specific to video workspace renamed to vid-premium-scroll.
 * 4. Viewport Lockdown: h-screen overflow-hidden prevents double scrollbars.
 * ================================================================================================
 * 🚀 JEMER ACADEMY ECOSYSTEM — VID2NOTES MASTER LAYOUT (v1.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow responsive React hooks for sidebar state

import React, { useState } from "react"; // Importing useState hook to manage sidebar visibility
import Sidebar from "@/jemer-components/layout/Sidebar.jsx"; // Importing the master fixed sidebar component from layout
import Navbar from "@/jemer-components/layout/Navbar.jsx"; // Importing the top command rail navbar component

// Main layout component that wraps all vid2notes pages
export default function Vid2NotesLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR VISIBILITY STATE ──
  // State variable to track if sidebar is visible or hidden
  // Initialized to true to perfectly match dashboard and audiobooks and prevent auto-closing on load
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER
    // h-screen locks height to viewport, w-full full width, overflow-hidden prevents body scroll
    // bg-slate-50 light mode, dark:bg-slate-950 dark mode, flex layout with relative positioning
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 🚀 CSS INJECTION: Custom Premium Scrollbars for Video Workspace */}
      {/* Injecting custom scrollbar styles to replace ugly default browser scrollbar with premium translucent one */}
      <style dangerouslySetInnerHTML={{__html: `
        .vid-premium-scroll::-webkit-scrollbar { width: 6px; }
        .vid-premium-scroll::-webkit-scrollbar-track { background: transparent; }
        .vid-premium-scroll::-webkit-scrollbar-thumb { background-color: rgba(148,163,184,0.3); border-radius: 10px; }
        .vid-premium-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(148,163,184,0.6); }
      `}} />

      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {/* Only renders when sidebar is visible on mobile, clicking it closes sidebar */}
      {/* fixed inset-0 covers full screen, z-30 sits above content but below sidebar, lg:hidden hides on desktop */}
      {isSidebarVisible && (
        <div
          onClick={() => setIsSidebarVisible(false)} // Click handler to close sidebar when backdrop is tapped
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-30 lg:hidden transition-all duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR */}
      {/* Sidebar component receives isOpen prop and onClose callback to control visibility */}
      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER */}
      {/* This is the main content column that shifts when sidebar opens/closes */}
      {/* flex-1 takes remaining space, flex-col stacks navbar and main vertically */}
      {/* Transition-all with lg:ml-64 creates the synchronized slide animation exactly like audiobooks */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* TOP COMMAND RAIL NAVBAR - Fixed header controlled visible */}
        {/* onMenuToggle flips sidebar visibility state when hamburger is clicked */}
        <Navbar onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} />

        {/* 📥 SELF-CONTAINED FIXED SEGMENTED MAIN COMPONENT CELL */}
        {/* This main area is the only scrollable region, keeping sidebar and navbar fixed */}
        {/* overflow-y-auto enables vertical scrolling, vid-premium-scroll applies custom scrollbar */}
        <main className="flex-1 overflow-y-auto vid-premium-scroll focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          {/* Note: Padding is completely removed here because we want vid-input to be edge-to-edge exactly like audiobooks */}
          {/* pb-24 gives space for mobile bottom nav, lg:pb-0 removes it on desktop */}
          <div className="w-full h-full pb-24 lg:pb-0">
            {children} {/* Renders the active stage component from page.js */}
          </div>
        </main>
      </div>
    </div>
  );
}