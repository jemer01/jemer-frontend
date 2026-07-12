/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Audio History Archive.
 * 1. Clean UI Architecture: Adapted the Snap history logic into a full-page grid layout optimized for audio files.
 * 2. Visual Polish: Stripped out all 'Pro/Budget' badges as requested, ensuring the UI remains focused on content retrieval.
 * 3. Handoff Navigation: Integrated a premium back button to return to the record screen instantly.
 * ================================================================================================
 * 📚 JEMER ACADEMY DESIGN SYSTEM — AUDIO HISTORY ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function AudioHistory({ onBack }) {
  // Dummy data representing past transcriptions
  const historyLogs = [
    { id: 1, title: "Advanced Quantum Mechanics Lecture", date: "Today", duration: "45:20" },
    { id: 2, title: "Philosophy 101 - Ethics", date: "Yesterday", duration: "1:12:05" },
    { id: 3, title: "Biology Cellular Structures", date: "Oct 24", duration: "22:15" },
    { id: 4, title: "Voice Memo - Math Formulas", date: "Oct 22", duration: "05:30" },
    { id: 5, title: "Economics Market Trends", date: "Oct 18", duration: "50:00" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in p-4 sm:p-0 max-w-5xl mx-auto min-h-[calc(100vh-80px)]">
      
      {/* ── HEADER ── */}
      <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-10">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
            title="Back to Record"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
          </button>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white tracking-tight text-xl">Audio Archives</h3>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Past Transcriptions & Notes</p>
          </div>
      </div>

      {/* ── HISTORY GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
        {historyLogs.map((log) => (
          <div 
            key={log.id} 
            className="group bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer active:scale-[0.98] flex flex-col justify-between h-48"
          >
            {/* Top Row: Icon & Date */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-headphones">
                  <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {log.date}
              </span>
            </div>

            {/* Bottom Row: Title & Duration */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {log.title}
              </h4>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{log.duration}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty State Fallback (If logic scales later) */}
        {historyLogs.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open mb-4 opacity-50">
              <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>
            </svg>
            <p className="text-sm font-medium">No audio archives found.</p>
          </div>
        )}
      </div>

    </div>
  );
}