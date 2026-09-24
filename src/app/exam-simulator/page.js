/**
 * ================================================================================================
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.2 - Feature Development Lock Integration.
 * 1. Maintenance Overlay Injection: Imported and mounted `<ExamLockModal />` at the root layer. 
 *    This locks the entire viewport with an uncloseable development barrier, cleanly hiding unfinished flows.
 * 2. 100% Architecture Preservation: Retained all SEO `metadata`, `<ExamsWidget />`, and headers untouched. 
 *    When the feature is ready, deleting the single `<ExamLockModal />` line immediately launches the CBT engine.
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — EXAM SIMULATOR PAGE ROUTER (v2.2)
 * ================================================================================================
 */

// Standard React library import
import React from "react"; 

// Import exam widget card grid component
import ExamsWidget from "@/jemer-components/ui/exams-widget"; 

// Import exam onboarding wizard modal component
import ExamModal from "@/jemer-components/ui/exam-modal"; 

// 🚀 NEW: Import the isolated Development Lock Modal
import ExamLockModal from "@/jemer-components/ui/exam-lock-modal";

export const metadata = {
  // Page title metadata tag
  title: "Exam Simulator | Jemer Academy",
  // Meta description tag for search indexing
  description: "Access official national CBT simulations, single-subject practice drills, AI study guides, and performance analytics.",
};

export default function ExamSimulatorPage() {
  return (
    // Outer animated wrapper container
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 animate-fade-in relative">
      
      {/* 🚀 NEW: DEVELOPMENT LOCK OVERLAY (Delete this line to launch the feature when ready) */}
      <ExamLockModal />

      {/* Onboarding Wizard (Preserved underneath lock) */}
      <ExamModal />

      {/* ── HIGH-FIDELITY HEADER REGION (Preserved) ── */}
      <header className="flex flex-col gap-3 lg:gap-4 relative z-10 mb-2">
        {/* Live ecosystem indicator badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/50 w-fit shadow-sm">
          {/* Animated pulsing dot */}
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
          {/* Badge title text */}
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            Jemer Examination Suite
          </span>
        </div>
        
        {/* Gradient Header Title */}
        <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400">Exam Simulations</span>
        </h1>
        
        {/* Header subtitle description text */}
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Prepare for national standardized exams with high-precision CBT practice, single-subject drills, instant AI explanations, and dedicated question hunting.
        </p>
      </header>

      {/* ── INTERACTIVE WIDGET GRID REGION (Preserved) ── */}
      <section className="w-full h-full">
        {/* Injects the interactive exam cards grid component */}
        <ExamsWidget />
      </section>

    </div>
  );
}