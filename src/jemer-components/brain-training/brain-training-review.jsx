"use client";

/**
 * ================================================================================================
 * 🧠 JEMER ACADEMY DESIGN SYSTEM — BRAIN TRAINING SYLLABUS BUILDER (v4.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v4.0.0]
 * SUMMARY: Phase 2 Blue Theme & Stunning "Neural Matrix" Loading Spinner
 * 1. THE GREAT RE-THEME: Swapped all `rose` and `amber` tokens to `blue` and `indigo` to enforce 
 *    the standardized Jemer UI palette.
 * 2. NEURAL MATRIX SPINNER: Ripped out the basic loading pulse. Built a magnificent 3D-styled 
 *    CSS "Neural Processing" animation featuring counter-rotating orbits and a glowing core. It 
 *    makes the wait time feel like a premium supercomputer analyzing data.
 * ================================================================================================
 */

import React, { useState } from "react";

export default function BrainTrainingReview({ promptText, onStartSession, onBack, isGenerating, generationStatus, realSessionConfig }) {
  const [customDuration, setCustomDuration] = useState(45);

  const handleLaunch = () => {
    if (realSessionConfig) {
      onStartSession({ durationMinutes: Number(customDuration) || 45 });
    }
  };

  let parsedPlan = realSessionConfig?.curriculum_plan;
  if (typeof parsedPlan === 'string') {
    try {
      parsedPlan = JSON.parse(parsedPlan);
    } catch (e) {
      parsedPlan = {};
    }
  }

  const syllabusItems = parsedPlan?.sub_topics || [];
  const totalQuestions = parsedPlan?.total_questions || realSessionConfig?.total_questions || 0;
  const topicName = parsedPlan?.topic || realSessionConfig?.topic || "Custom Neural Matrix";

  // 🚀 FIXED: Stunning Neural Matrix Loading Spinner
  if (isGenerating || !realSessionConfig) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center animate-fade-in px-4">
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes orbit-cw { 0% { transform: rotateZ(0deg) rotateX(60deg) rotateZ(0deg); } 100% { transform: rotateZ(360deg) rotateX(60deg) rotateZ(-360deg); } }
          @keyframes orbit-ccw { 0% { transform: rotateZ(0deg) rotateX(60deg) rotateZ(0deg); } 100% { transform: rotateZ(-360deg) rotateX(60deg) rotateZ(360deg); } }
          @keyframes core-pulse { 0%, 100% { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); } 50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 40px rgba(99, 102, 241, 0.8); } }
        `}} />

        <div className="relative w-40 h-40 mb-8 flex items-center justify-center perspective-[800px]">
          {/* Orbital Rings */}
          <div className="absolute inset-0 rounded-full border border-blue-500/20" style={{ animation: 'orbit-cw 6s linear infinite' }}></div>
          <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-blue-500" style={{ animation: 'orbit-cw 3s linear infinite' }}></div>
          <div className="absolute inset-6 rounded-full border-l-2 border-r-2 border-indigo-500" style={{ animation: 'orbit-ccw 4s linear infinite' }}></div>
          
          {/* Glowing Plasma Core */}
          <div className="absolute w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg" style={{ animation: 'core-pulse 2s ease-in-out infinite' }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">
          {generationStatus || "Synthesizing Syllabus..."}
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-mono text-center">Parsing parameters and forging neural pathways.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12 px-4 sm:px-0">
      
      {/* HEADER & NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="text-left">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-blue-600 transition-colors font-mono mb-3 focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Hub
          </button>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            {topicName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl mt-2 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span className="italic leading-relaxed">"{promptText}"</span>
          </p>
        </div>
      </div>

      {/* 🚀 FIXED: Re-themed METRICS GRID (Rose -> Blue/Indigo) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Output</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{totalQuestions} Questions</p>
          </div>
        </div>
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Difficulty</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">Adaptive</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/50 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Limit</p>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  value={customDuration} 
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-12 bg-transparent text-xl font-black text-slate-900 dark:text-white outline-none border-b border-dashed border-blue-300 dark:border-blue-700 focus:border-blue-500"
                  min="5" max="300"
                />
                <span className="text-lg font-bold text-slate-900 dark:text-white">Mins</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCustomDuration(15)} className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black transition-colors">15m</button>
            <button onClick={() => setCustomDuration(30)} className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black transition-colors">30m</button>
            <button onClick={() => setCustomDuration(60)} className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black transition-colors">60m</button>
          </div>
        </div>
      </div>

      {/* TACTICAL BREAKDOWN (TIMELINE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Step-by-Step Training Plan
        </h3>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          {syllabusItems.length > 0 ? syllabusItems.map((module, idx) => (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="text-xs font-black">{idx + 1}</span>
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Module {idx + 1}</span>
                  <span className="text-[10px] font-bold text-slate-500">{module.question_count} Qs</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{module.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{module.description}</p>
              </div>
            </div>
          )) : (
            <div className="w-full p-8 text-center text-slate-500 dark:text-slate-400 text-sm font-medium border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
              Constructing training pathway...
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div className="w-full flex justify-center pt-4">
        <button 
          onClick={handleLaunch}
          className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-3 focus:outline-none"
        >
          <span>Commence Neural Training</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
      </div>
    </div>
  );
}