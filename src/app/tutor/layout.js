/**
 * ================================================================================================
 * 🚀 JEMER ACADEMY PLATFORMS CORE ENGINE — AI TUTOR INTERFACE MASTER REGIONAL LAYOUT (v3.0)
 * ================================================================================================
 * [NEW UPGRADE — v3.0.0]
 * SUMMARY: Mobile Keyboard Fluidity & Dictionary Engine Preparation.
 * 1. DYNAMIC VIEWPORT SCALING: Upgraded the master wrapper from `h-screen` to `h-[100dvh]`. 
 *    This perfectly aligns with mobile browser mechanics. When the software keyboard opens, 
 *    the interface gracefully resizes instead of breaking the layout bounds or hiding the prompt box.
 * 2. DICTIONARY ENGINE INTEGRATION: Added state bindings and the structural mount for the upcoming 
 *    `<Dictionary />` component, ensuring it mirrors the fluid architecture of the Calculator.
 * ================================================================================================
 */

"use client";

import React, { useState } from "react"; 
import Sidebar from "@/jemer-components/layout/Sidebar.jsx"; 
import Navbar from "@/jemer-components/layout/Navbar.jsx"; 
import TutorSidebar from "@/jemer-components/ui/tutor-sidebar.jsx"; 
import Calculator from "@/jemer-components/ui/calculator.jsx"; 
import FullCalculator from "@/jemer-components/ui/full-calculator.jsx"; 
import Dictionary from "@/jemer-components/ui/dictionary.jsx"; // 🚀 NEW: Preparing the Dictionary Component

export default function TutorLayout({ children }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTutorSidebarOpen, setIsTutorSidebarOpen] = useState(false);

  const [calculatorView, setCalculatorView] = useState("closed");
  
  // 🚀 NEW: Dictionary Engine State (Mirrors the Calculator architecture)
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  return (
    // 🚀 FIXED: Swapped h-screen for h-[100dvh] to natively fix mobile keyboard scroll lockouts
    <div className="h-[100dvh] w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex relative transition-colors duration-200 font-sans">
      
      {(isSidebarVisible || isTutorSidebarOpen) && (
        <div
          onClick={() => {
            console.log("[TUTOR LAYOUT CAPTURE] Backdrop click detected. Collapsing active side drawers.");
            setIsSidebarVisible(false); 
            setIsTutorSidebarOpen(false); 
          }}
          className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-20 lg:hidden transition-all duration-300 animate-fade-in"
        />
      )}

      <Sidebar 
        isOpen={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />

      <div 
        className={`h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
          (isSidebarVisible || isTutorSidebarOpen) ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Navbar 
          onMenuToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
          onTutorSidebarToggle={() => setIsTutorSidebarOpen(!isTutorSidebarOpen)} 
          onCalculatorToggle={() => setCalculatorView(calculatorView === "mini" ? "closed" : "mini")} 
          onDictionaryToggle={() => setIsDictionaryOpen(!isDictionaryOpen)} // 🚀 NEW: Pass toggle capability to Navbar
        />

        <main className="flex-1 overflow-hidden focus:outline-none bg-slate-50/40 dark:bg-slate-950/40 relative">
          
          {children}

          <FullCalculator 
            isOpen={calculatorView === "full"} 
            onClose={() => setCalculatorView("closed")} 
            onMinimize={() => setCalculatorView("mini")} 
          />
          
        </main>
        
      </div>

      <TutorSidebar 
        isOpen={isTutorSidebarOpen} 
        onClose={() => setIsTutorSidebarOpen(false)} 
      />

      <Calculator 
        isOpen={calculatorView === "mini"} 
        onClose={() => setCalculatorView("closed")} 
        onMaximize={() => setCalculatorView("full")} 
      />

      {/* 🚀 NEW: Adaptive Dictionary Dropdown Panel Module */}
      {isDictionaryOpen && (
        <Dictionary 
          isOpen={isDictionaryOpen} 
          onClose={() => setIsDictionaryOpen(false)} 
        />
      )}

    </div>
  );
}