/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY PLATFORMS CORE ENGINE — AI TUTOR INTERFACE MASTER REGIONAL LAYOUT (v2.2)
 * ================================================================================================
 * Description: Master structural layout coordinator organizing menus, sidebars, headers, and tools.
 * Fixed Spacing Strategy: Enforces a uniform left track anchor ('lg:ml-64') when either menu triggers,
 * completely eliminating layout shifts or page compression when opening sidebars.
 * Layout Alignment Patch: Relocated the FullCalculator tag inside the main page viewport stream.
 * This guarantees it expands to exactly 100% of the active workspace without blocking headers.
 * Compliance: 100% complete line-by-line developer code documentation for maximum clarity.
 * ================================================================================================
 */

"use client"; // Marks client state compilation capabilities to permit responsive hook evaluation tracks

import React, { useState } from "react"; // Imports core hooks to drive responsive state triggers
import Sidebar from "@/jemer-components/layout/Sidebar.jsx"; // Injects your database cache-hydrated sidebar component
import Navbar from "@/jemer-components/layout/Navbar.jsx"; // Injects your high-contrast theme-adaptive top navbar asset
import TutorSidebar from "@/jemer-components/ui/tutor-sidebar.jsx"; // Injects your re-designed, left-aligned minimal history tracker sidebar panel
import Calculator from "@/jemer-components/ui/calculator.jsx"; // Injects your viewport-adaptive mini calculator component
import FullCalculator from "@/jemer-components/ui/full-calculator.jsx"; // Injects your robust full-screen advanced math canvas overlay

/**
 * Global AI Tutor Workspace Route Layout Handler
 * @param {Object} props - Structural properties argument parameters.
 * @param {React.ReactNode} props.children - Nested child component layouts streaming through sub-routes.
 */
export default function TutorLayout({ children }) {
  // ── LAYER 1: NAVIGATION SIDEBAR DRAWER VISIBILITY STATUS CORES ──────────────────────────────
  // Controls visibility parameters for the global platform side menu command rail
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  // Controls visibility parameters for the specialized, left-aligned tutor chat history panel
  const [isTutorSidebarOpen, setIsTutorSidebarOpen] = useState(false);

  // ── LAYER 2: MATHEMATICAL UTILITY CALCULATOR VIEW STATE ENGINE ─────────────────────────────
  // Tracks active presentation profiles for the computing workspace matrices
  // Values: "closed" (completely hidden) | "mini" (hanging dropdown or 70vh sheet) | "full" (maximized canvas dashboard overlay)
  const [calculatorView, setCalculatorView] = useState("closed");

  return (
    // 🏛️ MASTER VIEWPORT LOCKDOWN CONTAINER BOX BOUNDARY:
    // Forces explicit full screen measurements and clips content spills to guarantee solid frame layout symmetry.
    <div className="h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {/* 📡 MOBILE TRANSLUCENT BACKDROP DIM OVERLAY */}
      {/* Guarantees the dimming layer completely unmounts on laptop and widescreen monitors to avoid layout lockout bugs. */}
      {(isSidebarVisible || isTutorSidebarOpen) && (
        <div
          onClick={() => {
            console.log("[TUTOR LAYOUT CAPTURE] Backdrop click detected. Collapsing active side drawers.");
            setIsSidebarVisible(false); // Drop main app menu state
            setIsTutorSidebarOpen(false); // Drop auxiliary history drawer state
          }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-20 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      {/* 🖥️ VIEWPORT-LOCKED FIXED COMMAND SIDE NAVIGATION BAR:
          Layered at z-40. Receives visibility state commands to slide completely off-screen when closed. */}
      <Sidebar 
        isOpen={isSidebarVisible} // Connect visibility variable flags
        onClose={() => setIsSidebarVisible(false)} // Connect structural close handlers
      />

      {/* 🚀 PRIMARY WORKSPACE CONTENT AREA COLUMN LAYER:
          Transitions fluidly between open and closed modes based on sidebar alignment variables.
          Enforces a matching 'lg:ml-64' left runway boundary whenever EITHER the main dashboard rail 
          OR the specialized tutor history sidebar is active. This locks the center layout canvas in place, 
          preventing the page components or prompt box from shifting to the left when opening side panels. */}
      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          (isSidebarVisible || isTutorSidebarOpen) ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        
        
        <Navbar 
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} // Connect menu inversion callbacks
          onTutorSidebarToggle={() => setIsTutorSidebarOpen(!isTutorSidebarOpen)} // Pass the smart auxiliary panel visibility state toggle
          onCalculatorToggle={() => setCalculatorView(calculatorView === "mini" ? "closed" : "mini")} // Invert calculation sheet triggers
        />

        {/* 📥 SELF-CONTAINED FIXED SEGMENTED MAIN COMPONENT CELL:
            Overrides traditional page scrolling vectors, locking content panels cleanly inside fixed viewport bounds. */}
        <main className="flex-1 overflow-hidden focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          
          {/* Inject dynamic feature contents and input widgets safely into the master container runway */}
          {children}

          {/* 🧮 ADVANCED FULL SCREEN ADVANCED MATH CANVAS INFRASTRUCTURE OVERLAY:
              ⚡ LAYOUT OVERHAUL REFACTOR: Moved the robust full screen module out of the root layout tree and injected 
              it directly inside the main workspace viewport container as a sibling to children nodes. 
              This ensures it fills 100% of the active tutor section workspace perfectly without breaking layout alignments, 
              keeping the top Navbar and left sidebars completely operational and responsive across all screens! */}
          <FullCalculator 
            isOpen={calculatorView === "full"} // Mounts when state reads robust fullscreen view profile
            onClose={() => setCalculatorView("closed")} // Complete termination exit track handler
            onMinimize={() => setCalculatorView("mini")} // Roll calculation records back down to compact mini states cleanly
          />
          
        </main>
        
      </div>

      {/* 📜 RE-DESIGNED AUXILIARY TUTOR MANAGEMENT SIDEBAR PANEL:
          Layered at the superior 'z-50' position on the left margin (left-0) inside your master wrapper.
          When expanding, it transitions out cleanly over the top of the general app rail, satisfying your left-alignment guidelines perfectly. */}
      <TutorSidebar 
        isOpen={isTutorSidebarOpen} // Connect visible flag triggers
        onClose={() => setIsTutorSidebarOpen(false)} // Pass secure closure state rollbacks
      />

      {/* 🧮 ADAPTIVE COMPACT CALCULATOR DROPDOWN PANEL MODULE:
          Mounted cleanly at the layout baseline tier. Catches incoming active flags and maps state modification 
          callbacks upward to either drop the views entirely or elevate operations into fullscreen canvas panels. */}
      <Calculator 
        isOpen={calculatorView === "mini"} // Mounts when state reads mini profile viewports
        onClose={() => setCalculatorView("closed")} // Wipe visibility variables to hide layouts
        onMaximize={() => setCalculatorView("full")} // Switch values to invoke robust fullscreen frames
      />

    </div>
  );
}