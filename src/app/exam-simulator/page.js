// Standard React library import[cite: 6]
import React from "react"; 

// Import exam widget card grid component[cite: 6]
import ExamsWidget from "@/jemer-components/ui/exams-widget"; 

// Import exam onboarding wizard modal component[cite: 6]
import ExamModal from "@/jemer-components/ui/exam-modal"; 

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY ECOSYSTEM — EXAM SIMULATOR PAGE ROUTER (v2.1)[cite: 6]
 * ================================================================================================
 * Server-rendered main route page for `/exam` preserving SEO metadata execution.[cite: 6]
 */
export const metadata = {
  // Page title metadata tag[cite: 6]
  title: "Exam Simulator | Jemer Academy",
  // Meta description tag for search indexing[cite: 6]
  description: "Access official national CBT simulations, single-subject practice drills, AI study guides, and performance analytics.",
};

export default function ExamSimulatorPage() {
  return (
    // Outer animated wrapper container[cite: 6]
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 lg:gap-10 animate-fade-in relative">
      
      {/* 🚀 ONBOARDING MODAL OVERLAY INJECTION */}
      {/* Mounted at root level[cite: 6] */}
      <ExamModal />

      {/* ── HIGH-FIDELITY HEADER REGION ──[cite: 6] */}
      <header className="flex flex-col gap-3 lg:gap-4 relative z-10 mb-2">
        {/* Live ecosystem indicator badge[cite: 6] */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-800/50 w-fit shadow-sm">
          {/* Animated pulsing dot[cite: 6] */}
          <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
          {/* Badge title text[cite: 6] */}
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
            Jemer Examination Suite
          </span>
        </div>
        
        {/* Gradient Header Title[cite: 6] */}
        <h1 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400">Exam Simulations</span>
        </h1>
        
        {/* Header subtitle description text[cite: 6] */}
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Prepare for national standardized exams with high-precision CBT practice, single-subject drills, instant AI explanations, and dedicated question hunting.
        </p>
      </header>

      {/* ── INTERACTIVE WIDGET GRID REGION ──[cite: 6] */}
      <section className="w-full h-full">
        {/* Injects the interactive exam cards grid component[cite: 6] */}
        <ExamsWidget />
      </section>

    </div>
  );
}