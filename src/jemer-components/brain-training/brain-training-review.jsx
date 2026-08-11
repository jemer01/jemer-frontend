// src/jemer-components/brain-training/brain-training-review.jsx
"use client";
/**
 * [NEW UPGRADE]
 * SUMMARY: v2.0 Live Syllabus & SSE State Integration.
 * 1. Live SSE Integration: Now uses `isGenerating` and `generationStatus` from `page.js` to render real-time pipeline telemetry while the 550B model thinks.
 * 2. Dynamic Curriculum Hydration: Instantly drops the dummy `mockSyllabus` and renders the actual `curriculum_plan` JSON payload parsed from the database.
 * 3. Perfect Handoff: Seamlessly passes the `realSessionConfig` into the CBT Session stage on launch.
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING SYLLABUS BUILDER (v2.0)
 * ================================================================================================
 */
import React from "react";

export default function BrainTrainingReview({ promptText, onStartSession, onBack, isGenerating, generationStatus, realSessionConfig }) {
  
  const handleLaunch = () => {
    // Pass the real configuration payload securely to the session engine
    if (realSessionConfig) {
      onStartSession(realSessionConfig);
    }
  };

  // Safely extract the curriculum plan and sub_topics from the AI payload
  const syllabusItems = realSessionConfig?.curriculum_plan?.sub_topics || [];
  const totalQuestions = realSessionConfig?.curriculum_plan?.total_questions || 0;
  const topicName = realSessionConfig?.curriculum_plan?.topic || "Custom Neural Matrix";

  // While the backend is streaming SSE data, show the immersive loader
  if (isGenerating || !realSessionConfig) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-rose-100 dark:border-rose-900/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-rose-500">
            {/* Brain SVG */}
            <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center px-4">
          {generationStatus || "Synthesizing Syllabus..."}
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-mono text-center px-4">Parsing prompt and generating neural pathways.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 px-4 sm:px-0">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          HEADER & NAVIGATION
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="text-left">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-rose-600 transition-colors font-mono mb-3 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Hub
          </button>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            {topicName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-2 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="italic leading-relaxed">"{promptText}"</span>
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          METRICS GRID
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-800/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Output</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalQuestions} Questions</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-100 dark:border-orange-800/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Difficulty</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">Adaptive</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">~45 Mins</p>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          TACTICAL BREAKDOWN (TIMELINE)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Step-by-Step Training Plan
        </h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          {syllabusItems.map((module, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-black">{idx + 1}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Module {idx + 1}</span>
                  <span className="text-[10px] font-bold text-slate-500">{module.question_count} Qs</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{module.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          BOTTOM CTA
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full flex justify-center pt-4">
        <button 
          onClick={handleLaunch}
          className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-rose-500/30 active:scale-95 flex items-center justify-center gap-3 focus:outline-none"
        >
          <span>Commence Neural Training</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  );
}
