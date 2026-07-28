// src/jemer-components/brain-training/brain-training-history.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - BRAIN TRAINING HISTORY ARCHIVES)
 * ================================================================================================
 * 1. COGNITIVE ARCHIVES GRID: Designed a stunning responsive grid (1 col mobile, 2 col tablet, 
 *    3 col desktop) to display the user's past training modules without wasting white space.
 * 2. GAMIFIED PROGRESS METRICS: Each card visualizes progress via a "Synapse Activation" 
 *    percentage bar, colored conditionally (Emerald for Mastery, Rose/Amber for Pending).
 * 3. PURE NATIVE SVGS: Used absolute pristine inline SVGs (Brains, Code, Play buttons) to 
 *    eliminate external font icon dependencies and guarantee perfect rendering.
 * 4. ROUTING HANDLER: Clicking any card fires `onResume(sessionData)`, bypassing the syllabus 
 *    review and jumping straight back into the action.
 * ================================================================================================
 */

import React from "react";

// Realistic Dummy Data for previous custom brain training modules
const MOCK_TRAINING_ARCHIVES = [
  {
    id: "trn_001",
    topic: "Laws of Thermodynamics",
    status: "Mastered",
    progress: 92,
    questionsTotal: 25,
    lastActive: "2 days ago",
    categoryIcon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
    )
  },
  {
    id: "trn_002",
    topic: "JavaScript Closures",
    status: "Pending",
    progress: 45,
    questionsTotal: 40,
    lastActive: "4 hours ago",
    categoryIcon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
    )
  },
  {
    id: "trn_003",
    topic: "Advanced French Phrasal Verbs",
    status: "Pending",
    progress: 15,
    questionsTotal: 20,
    lastActive: "1 week ago",
    categoryIcon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
    )
  },
  {
    id: "trn_004",
    topic: "Macroeconomics: Supply & Demand",
    status: "Mastered",
    progress: 100,
    questionsTotal: 15,
    lastActive: "2 weeks ago",
    categoryIcon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
    )
  }
];

export default function BrainTrainingHistory({ onResume }) {
  return (
    <div className="w-full space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white flex items-center gap-2">
            {/* 🆕 Brain SVG Icon */}
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.82 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.496 1.509 1.333 1.509 2.316V18" />
            </svg>
            Your Cognitive Archives
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Resume incomplete sessions or review past material to reinforce memory pathways.
          </p>
        </div>
      </div>

      {/* Responsive Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MOCK_TRAINING_ARCHIVES.map((session) => {
          const isMastered = session.progress >= 85;
          
          return (
            <div 
              key={session.id}
              onClick={() => onResume(session)} // Passes mock data straight to Stage 3 (Session)
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 cursor-pointer flex flex-col"
            >
              
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                  isMastered ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400"
                }`}>
                  {session.categoryIcon}
                </div>
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  isMastered ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                }`}>
                  {session.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {session.topic}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-6">
                {session.questionsTotal} Questions • Last active {session.lastActive}
              </p>

              <div className="mt-auto space-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Synapse Activation</span>
                  <span className={isMastered ? "text-emerald-500" : "text-rose-500"}>{session.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${isMastered ? "bg-emerald-500" : "bg-rose-500"}`} 
                    style={{ width: `${session.progress}%` }}
                  />
                </div>
              </div>

              {/* Hover Play/Resume Button Overlay Effect */}
              <div className="absolute inset-0 bg-white/0 dark:bg-slate-900/0 group-hover:bg-white/40 dark:group-hover:bg-slate-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl flex items-center justify-center">
                <button className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-all duration-300">
                  {/* 🆕 Native Play SVG */}
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}