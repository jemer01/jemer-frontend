/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 6-Tab Audiobooks Results Matrix.
 * 1. Seamless Tab System: Integrates 'Summary', 'Full Notes', 'Interactive Quiz', 'Key Points', 'Action Items', and 'Transcript'.
 * 2. Premium Content Rendering: Employs `<MarkdownRenderer />` to dynamically map the `analysisData` JSON and the native `transcript` payload securely to the screen.
 * 3. Pro Visual Architecture: Horizontally scrollable tab bar with smooth active-state underlines.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS RESULTS ENGINE (v2.0)
 * ================================================================================================
 */

"use client";

import React, { useState } from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function AudioResults({ audioData, onReset, onChat, analysisData, transcript }) {
  const [activeTab, setActiveTab] = useState("summary");

  // The 6 specific target keys matching the Go backend logic perfectly
  const TABS = [
    { id: "summary", label: "Summary", icon: "fa-align-left" },
    { id: "full_notes", label: "Full Notes", icon: "fa-book-open" },
    { id: "interactive_quiz", label: "Interactive Quiz", icon: "fa-question-circle" },
    { id: "key_points", label: "Key Points", icon: "fa-star" },
    { id: "action_items", label: "Action Items", icon: "fa-check-square" },
    { id: "transcript", label: "Transcript", icon: "fa-file-audio" }
  ];

  // Dynamically resolves the specific content based on the active tab
  const getActiveContent = () => {
    if (activeTab === "transcript") {
      return transcript || "*No transcript generated for this audio file.*";
    }
    // Pulls safely from the mapped JSON block
    return analysisData?.[activeTab] || `*No ${activeTab.replace('_', ' ')} generated for this session.*`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in pb-12 pt-6 px-4 lg:px-0">
      
      {/* ── HEADER PIPELINE ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white tracking-tight">
            Audiobook <span className="text-indigo-600 dark:text-indigo-400">Analysis</span>
          </h1>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-1">Processing Complete</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onReset} 
            className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-3 px-5 rounded-xl font-bold uppercase tracking-wider shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <i className="fas fa-microphone-alt"></i> Record New
          </button>
          <button 
            onClick={onChat} 
            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-3 px-5 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/25 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
          >
            <i className="fas fa-comments"></i> Tutor Chat
          </button>
        </div>
      </div>

      {/* ── 6-TAB MATRIX NAVIGATION ── */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        
        <div className="flex w-max sm:w-full min-w-full">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-sm font-black uppercase tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" 
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT RENDERER ── */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl dark:shadow-2xl/50 min-h-[400px]">
        <div className="prose dark:prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 relative w-full whitespace-pre-wrap break-words overflow-x-hidden">
          {/* Dynamically loads whichever section the user clicks */}
          <MarkdownRenderer text={getActiveContent()} />
        </div>
      </div>
      
    </div>
  );
}
