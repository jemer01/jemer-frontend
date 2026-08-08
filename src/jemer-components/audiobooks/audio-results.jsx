/**
 * [NEW] v2.1
 * SUMMARY: Executed v2.1 Interactive Quiz State Machine.
 * 1. Interactive Quiz Override: When `activeTab === "interactive_quiz"`, completely bypasses `<MarkdownRenderer />` and mounts a custom, fully interactive A-D quiz engine.
 * 2. Gamification Logic: Manages state for selected answers per question, locking options on click. Visually highlights the selected answer (Red for fail, Emerald for pass) and forces the correct answer to glow green if failed.
 * 3. Learning Reinforcement: Smoothly animates the AI's detailed explanation into view instantly after the user clicks their choice to reinforce the spaced-repetition logic.
 * 4. Multi-Speaker Styling: Kept `whitespace-pre-wrap` active in the MarkdownRenderer so diarized meeting transcripts flow beautifully.
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS RESULTS ENGINE (v2.1)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import MarkdownRenderer from "@/jemer-components/ui/markdown-renderer.jsx";

export default function AudioResults({ audioData, onReset, onChat, analysisData, transcript }) {
  const [activeTab, setActiveTab] = useState("summary");
  
  // Interactive Quiz States
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // Reset quiz state if a new audiobook is loaded from history
  useEffect(() => {
    setSelectedAnswers({});
  }, [analysisData]);

  // The 6 specific target keys matching the Go backend logic perfectly
  const TABS = [
    { id: "summary", label: "Summary", icon: "fa-align-left" },
    { id: "full_notes", label: "Full Notes", icon: "fa-book-open" },
    { id: "interactive_quiz", label: "Interactive Quiz", icon: "fa-question-circle" },
    { id: "key_points", label: "Key Points", icon: "fa-star" },
    { id: "action_items", label: "Action Items", icon: "fa-check-square" },
    { id: "transcript", label: "Transcript", icon: "fa-file-audio" }
  ];

  // Handles logic for user clicking an option A-D in the quiz tab
  const handleOptionClick = (questionIndex, optionKey) => {
    // Prevent changing answer if already selected
    if (selectedAnswers[questionIndex]) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionKey
    }));
  };

  // Dedicated renderer for the Interactive Quiz Engine
  const renderInteractiveQuiz = () => {
    const quizData = analysisData?.interactive_quiz;
    
    // Fallback if the backend AI failed to generate the array properly
    if (!Array.isArray(quizData) || quizData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
          <i className="fas fa-question-circle text-4xl mb-3 opacity-50"></i>
          <p className="text-sm font-mono uppercase tracking-widest">No interactive quiz generated for this session.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto pb-4">
        {quizData.map((q, index) => {
          const isAnswered = !!selectedAnswers[index];
          const selectedKey = selectedAnswers[index];
          
          return (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/30 p-5 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm transition-all">
              
              {/* Question Header */}
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 leading-relaxed">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">{index + 1}.</span>
                {q.question}
              </h3>
              
              {/* Options Grid */}
              <div className="flex flex-col gap-3">
                {Object.entries(q.options || {}).map(([key, value]) => {
                  
                  // Default Styling
                  let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300";
                  
                  // Post-Answer Styling Evaluation
                  if (isAnswered) {
                    if (key === q.correct_answer) {
                      // The correct answer always highlights green
                      btnClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-500/50";
                    } else if (key === selectedKey) {
                      // The wrong answer selected by the user highlights red
                      btnClass = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-300 shadow-sm";
                    } else {
                      // Unselected wrong answers fade out
                      btnClass = "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40";
                    }
                  }

                  return (
                    <button 
                      key={key}
                      onClick={() => handleOptionClick(index, key)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base transition-all duration-300 ${btnClass} ${!isAnswered ? 'active:scale-[0.99] cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="font-black mr-3 opacity-60 inline-block w-4">{key}.</span> 
                      {value}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Reveal (Spaced Repetition Hook) */}
              {isAnswered && (
                <div className="mt-5 p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20 animate-fade-in flex gap-3 sm:gap-4 items-start">
                  <div className="mt-0.5 shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    {selectedKey === q.correct_answer ? (
                      <i className="fas fa-check text-emerald-500 text-[10px] sm:text-xs"></i>
                    ) : (
                      <i className="fas fa-times text-red-500 text-[10px] sm:text-xs"></i>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                      <span className="font-black block sm:inline sm:mr-2 mb-1 sm:mb-0">Explanation:</span> 
                      {q.explanation}
                    </p>
                  </div>
                </div>
              )}
              
            </div>
          );
        })}
      </div>
    );
  };

  // Dynamically resolves the specific content based on the active tab for Markdown Renderer
  const getActiveContent = () => {
    if (activeTab === "transcript") {
      return transcript || "*No transcript generated for this audio file.*";
    }
    // Safely extract string data from the other tabs
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
        
        {/* Render interactive quiz logic if tab is selected, otherwise render standard markdown */}
        {activeTab === "interactive_quiz" ? (
          renderInteractiveQuiz()
        ) : (
          <div className="prose dark:prose-invert prose-indigo max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 relative w-full whitespace-pre-wrap break-words overflow-x-hidden">
            <MarkdownRenderer text={getActiveContent()} />
          </div>
        )}
        
      </div>
      
    </div>
  );
}
