/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.1 First-Time Onboarding Integration.
 * 1. Modal Injection: Safely imported and mounted `<ToolsOnboardingModal />` without converting `page.js` into a client component, thereby preserving your SEO `metadata` config flawlessly.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — LEARNING TOOLS PAGE ROUTER (v2.1)
 * ================================================================================================
 */

import React from "react"; // Standard React import
import ToolsWidgets from "@/jemer-components/ui/tools-widgets.jsx"; // Imports our custom interactive grid interface
import ToolsOnboardingModal from "@/jemer-components/ui/tools-onboarding-modal.jsx"; // Imports the new onboarding flow

export const metadata = {
  title: "Learning Tools | Jemer Academy",
  description: "Access premium AI learning utilities including Snap to Answer and Vid2Notes.",
};

export default function LearningToolsPage() {
  return (
    // Outer boundary wrapper ensuring smooth fade-in animations on route load
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 animate-fade-in relative">
      
      {/* 🚀 ONBOARDING MODAL OVERLAY INJECTION */}
      <ToolsOnboardingModal />

      {/* ── HIGH-FIDELITY HEADER REGION ── */}
      <header className="flex flex-col gap-3 lg:gap-4 relative z-10 mb-2">
        {/* Pulsing Ecosystem Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/50 w-fit shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
            Jemer Intelligence Suite
          </span>
        </div>
        
        {/* Gradient Typography Engine */}
        <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Learning Tools</span>
        </h1>
        
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Supercharge your study workflow. Convert 2-hour YouTube lectures into instant notes, or deploy our computer vision AI to solve complex diagrams and equations on the fly.
        </p>
      </header>

      {/* ── INTERACTIVE WIDGET GRID REGION ── */}
      <section className="w-full h-full">
        <ToolsWidgets />
      </section>

    </div>
  );
}