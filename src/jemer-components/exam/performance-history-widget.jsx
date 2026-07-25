// jemer-components/exam/performance-history-widget.jsx
"use client";

/**
 * ================================================================================================
 * 🆕 NEW COMPONENT SUMMARY (v1.0 - PERFORMANCE HISTORY WIDGET)
 * ================================================================================================
 * 1. VERTICAL LIST ARCHITECTURE: Designed a sleek, clean, vertical list mapping out previous exams, 
 *    discarding bulky cards to ensure maximum readability and data density.
 * 2. DYNAMIC THEME MAPPING: Automatically applies the correct colorway (Green, Blue, Orange, Purple, Teal) 
 *    to the badges and icons of each list item based on its `mode` property.
 * 3. GLOBAL STATS HEADER: Features a premium dashboard header summarizing total taken exams and 
 *    average scores across all platforms.
 * 4. RESPONSIVE DESIGN: Perfectly handles overflow, text truncation on mobile, and hover scaling 
 *    effects for a highly tactile UX.
 * ================================================================================================
 */

import React from "react";

// Mock Historical Data Spanning All 5 Jemer Exam Modes
const MOCK_HISTORY_RECORDS = [
  {
    id: "rec_001", mode: "jamb", date: "Jul 24, 2026", title: "JAMB UTME Simulation", scoreText: "285 / 400", timeUsed: "1h 45m",
    config: {
      durationMinutes: 120,
      subjects: [
        { id: "english", name: "Use of English", count: 60 }, { id: "mathematics", name: "Mathematics", count: 40 },
        { id: "physics", name: "Physics", count: 40 }, { id: "chemistry", name: "Chemistry", count: 40 },
      ]
    }
  },
  {
    id: "rec_002", mode: "waec", date: "Jul 20, 2026", title: "WASSCE Mock Exam", scoreText: "5 Distinctions", timeUsed: "Var. Subjects",
    config: {
      durationMinutes: 60,
      subjects: [
        { id: "english", name: "English", count: 80 }, { id: "mathematics", name: "Mathematics", count: 50 },
        { id: "physics", name: "Physics", count: 50 }, { id: "biology", name: "Biology", count: 50 },
        { id: "chemistry", name: "Chemistry", count: 50 },
      ]
    }
  },
  {
    id: "rec_003", mode: "hunter", date: "Jul 18, 2026", title: "Questions Hunter", scoreText: "85% (A1)", timeUsed: "32m 10s",
    config: {
      durationMinutes: 60,
      subjects: [{ id: "custom_hunt", name: "Custom AI Generation", count: 20 }]
    }
  },
  {
    id: "rec_004", mode: "study", date: "Jul 15, 2026", title: "Active Learning Room", scoreText: "92% (A1)", timeUsed: "40m 05s",
    config: {
      durationMinutes: 45,
      subjects: [{ id: "biology", name: "Biology", count: 30 }]
    }
  },
  {
    id: "rec_005", mode: "practice", date: "Jul 10, 2026", title: "Speed Practice Drill", scoreText: "68% (B3)", timeUsed: "18m 45s",
    config: {
      durationMinutes: 30,
      subjects: [{ id: "economics", name: "Economics", count: 40 }]
    }
  }
];

export default function PerformanceHistoryWidget({ onSelectRecord }) {

  // Utility to grab dynamic colors based on the mode of the past exam
  const getModeStyles = (mode) => {
    switch (mode) {
      case "jamb": return { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800/50", label: "JAMB CBT" };
      case "waec": return { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800/50", label: "WASSCE" };
      case "practice": return { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50", label: "Practice" };
      case "study": return { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800/50", label: "Study Room" };
      case "hunter": return { bg: "bg-teal-100 dark:bg-teal-900/40", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800/50", label: "AI Hunt" };
      default: return { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700", label: "Exam" };
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* HEADER: Global Statistics Dashboard */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
        
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Performance History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Track your progression across all JAMB, WAEC, and AI-generated exams.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">24</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Exams</span>
          </div>
          <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">78%</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Avg Score</span>
          </div>
        </div>
      </div>

      {/* BODY: Vertical Historical Records List */}
      <div className="space-y-3">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 pl-2">
          Recent Sessions
        </h3>
        
        <div className="flex flex-col gap-3">
          {MOCK_HISTORY_RECORDS.map((record) => {
            const styles = getModeStyles(record.mode);
            const subjectNames = record.config.subjects.map(s => s.name).join(", ");
            const totalQs = record.config.subjects.reduce((acc, s) => acc + s.count, 0);

            return (
              <div 
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                {/* Subtle Hover Gradient Accent */}
                <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />

                {/* Left Side: Mode Badge, Title & Date */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${styles.bg} ${styles.text} ${styles.border}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${styles.bg} ${styles.text}`}>
                        {styles.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {record.date}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {record.title}
                    </h4>
                  </div>
                </div>

                {/* Middle/Right Side: Metadata & Score */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  {/* Subject Summary (Hidden on tiny phones, truncated elsewhere) */}
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {subjectNames}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {totalQs} Questions • {record.timeUsed}
                    </span>
                  </div>

                  {/* Score & View Trigger */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Score</span>
                      <span className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white">
                        {record.scoreText}
                      </span>
                    </div>
                    
                    <button className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-100 dark:bg-slate-800 dark:group-hover:bg-indigo-900/40 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-center transition-colors shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}