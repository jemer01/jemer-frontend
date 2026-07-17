/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v4.0 Audio Results Premium UI/UX Overhaul & Media Engine.
 * 1. Native SVG Architecture: Eradicated all broken legacy FontAwesome (`<i className="fas fa-*">`) classes. Replaced them with robust, inline React SVGs for flawless cross-device rendering.
 * 2. Premium Geometry & Responsiveness: Upgraded buttons to `rounded-2xl` and `rounded-full` for a modern, high-end look. Implemented responsive flex-wrapping and text hiding on ultra-slim mobile screens so the toolbar never squishes.
 * 3. Custom CSS Audio Engine: Built a beautiful, dynamic inline audio player that toggles open when "Play Audio" is clicked, complete with a custom progress bar and playback controls.
 * 4. Custom Mobile Scrollbar: Replaced the ugly default HTML horizontal scrollbar on the tabs with a sleek, custom webkit scrollbar via injected CSS.
 * 5. Spatial Consistency: Added protective padding (`px-4 sm:px-6`) to the master container to ensure tab content never aggressively touches the screen edges on mobile devices.
 * 6. Legacy Preservation: Maintained the critical title wrapping (`whitespace-normal break-words`) and the Stage 5 Results layout scaffolding per the v3.0 specs[cite: 2].
 * ================================================================================================
 * ✨ JEMER ACADEMY DESIGN SYSTEM — AUDIO RESULTS ENGINE (v4.0)
 * ================================================================================================
 */

"use client"; // Designates this file as a React Client Component for Next.js

// Importing necessary hooks from React for state and DOM reference management
import React, { useState, useRef } from "react";

// Main export function, receiving audioData, onReset, and onChat props from the parent
export default function AudioResults({ audioData, onReset, onChat }) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Controls which tab content is currently visible. Defaults to the "summary" tab[cite: 2].
  const [activeTab, setActiveTab] = useState("summary");
  
  // Controls the visibility of our new custom CSS audio player
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Tracks if the audio is currently playing or paused
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Tracks the current progress of the audio playback (0 to 100)
  const [progress, setProgress] = useState(0);

  // ==========================================
  // REFS
  // ==========================================
  
  // Reference to the hidden HTML5 <audio> element to control playback via our custom UI
  const audioRef = useRef(null);

  // ==========================================
  // CONFIGURATIONS
  // ==========================================
  
  // Array defining our tab navigation structure and labels[cite: 2]
  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "raw_notes", label: "Full Notes" },
    { id: "quiz", label: "Interactive Quiz" },
    { id: "key_points", label: "Key Points" },
    { id: "action_items", label: "Action Items" },
    { id: "transcript", label: "Transcript (Timeline)" }
  ];

  // ==========================================
  // HELPER FUNCTIONS (AUDIO PLAYER)
  // ==========================================
  
  // Toggles the visibility of the audio player UI. Resets playback if closed.
  const togglePlayerVisibility = () => {
    if (showPlayer && isPlaying) {
      // Pause audio if the user closes the player
      audioRef.current.pause();
      setIsPlaying(false);
    }
    setShowPlayer(!showPlayer);
  };

  // Handles playing and pausing the actual audio element
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Updates the progress bar width based on the audio element's current time
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      // Calculate percentage and update state. Fallback to 0 if NaN.
      setProgress((current / total) * 100 || 0);
    }
  };

  // Resets the player icon when the audio finishes playing
  const handleAudioEnd = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // ==========================================
  // UI RENDER BLOCK
  // ==========================================

  return (
    // MASTER CONTAINER: Added px-4 sm:px-6 so content never touches the absolute edge of the screen on mobile
    <div className="w-full flex flex-col animate-fade-in max-w-6xl mx-auto pb-20 px-4 sm:px-6">
      
      {/* 🚀 CSS INJECTION: Custom scrollbar for tabs to replace the ugly default HTML one */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Targets the custom class for the tab container */
        .jemer-premium-scroll::-webkit-scrollbar { 
          height: 6px; 
        }
        /* Makes the track transparent so it blends with the theme */
        .jemer-premium-scroll::-webkit-scrollbar-track { 
          background: transparent; 
        }
        /* Styles the draggable thumb with a premium slate color and rounded edges */
        .jemer-premium-scroll::-webkit-scrollbar-thumb { 
          background-color: #cbd5e1; 
          border-radius: 20px; 
        }
        /* Dark mode overrides for the scrollbar thumb */
        .dark .jemer-premium-scroll::-webkit-scrollbar-thumb { 
          background-color: #475569; 
        }
      `}} />

      {/* ── HEADER & TOOLBAR ── */}
      {/* Flex row on desktop, flex col on mobile. Gap adjusted for better spacing. */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 pt-4">
        
        {/* Title & Status Badge Section */}
        <div className="w-full md:flex-1 min-w-0 pr-0 md:pr-4">
          {/* Preserved the critical whitespace-normal and break-words for long titles[cite: 2] */}
          <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 dark:text-white mb-3 whitespace-normal break-words leading-tight">
            {audioData?.name || "Advanced Quantum Mechanics Lecture Notes"}
          </h2>
          
          {/* Upgraded Status Badge with a native React SVG checkmark instead of FontAwesome */}
          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/30 px-3.5 py-1.5 rounded-full inline-flex items-center border border-indigo-200 dark:border-indigo-500/30 tracking-wide uppercase shadow-sm">
            {/* Native SVG Check Circle Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Analysis Complete
          </div>
        </div>
        
        {/* Action Toolbar Section */}
        {/* Added flex-wrap and optimized button padding to prevent squishing on slim screens */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
          
          {/* Start Over / New Button */}
          {/* Upgraded to rounded-2xl for a softer, premium look */}
          <button 
            onClick={onReset} 
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
          >
            {/* Native SVG Reset/Rotate Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span className="hidden sm:inline">New</span>
          </button>
          
          {/* Play Audio Button (Now controls the dynamic UI player) */}
          <button 
            onClick={togglePlayerVisibility}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm border ${showPlayer ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50'}`}
          >
            {/* Native SVG Play/Close Icon based on state */}
            {showPlayer ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            )}
            <span>{showPlayer ? "Close Player" : "Play Audio"}</span>
          </button>

          {/* Resources / Download Button */}
          <button 
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
          >
            {/* Native SVG Folder Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span className="hidden sm:inline">Resources</span>
          </button>

          {/* Ask Prof. Jemer Main Action Button */}
          <button 
            onClick={onChat} 
            // Upgraded to full-rounded, premium gradient, deeper shadows, and removed hover translation that causes jitters
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 group active:scale-95"
          >
            {/* Native SVG Message/Teacher Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Ask Prof. Jemer</span>
          </button>
        </div>
      </div>

      {/* ── CUSTOM DYNAMIC AUDIO PLAYER ── */}
      {/* Renders conditionally with a smooth slide-down animation if showPlayer is true */}
      {showPlayer && (
        <div className="w-full bg-slate-900 dark:bg-black rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-2xl border border-slate-800 animate-fade-in relative overflow-hidden">
          
          {/* Subtle background glow effect inside the player */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>

          {/* Hidden HTML5 Audio Element used for actual playback logic */}
          <audio 
            ref={audioRef} 
            src={audioData?.url || ""} // Fallback if no URL provided
            onTimeUpdate={handleTimeUpdate} // Triggers progress bar updates
            onEnded={handleAudioEnd} // Resets UI when audio finishes
            className="hidden"
          />

          {/* Play/Pause Control Button */}
          <button 
            onClick={togglePlayPause}
            className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all z-10"
          >
            {isPlaying ? (
              // Pause Icon
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              // Play Icon (Translate X to center visually)
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>

          {/* Custom Audio Progress Bar Area */}
          <div className="flex-1 w-full flex flex-col justify-center z-10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-200">
                {audioData?.name || "Audio Recording"}
              </span>
              {/* Dynamic status text */}
              <span className="text-xs font-mono text-indigo-400">
                {isPlaying ? "Playing..." : "Paused"}
              </span>
            </div>
            
            {/* The Track Line */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              {/* The dynamic progress fill based on calculated state */}
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* ── TABBED NAVIGATION ── */}
      {/* 🚀 THE FIX: Added jemer-premium-scroll class to hook into our custom CSS injected above */}
      <div className="flex overflow-x-auto pb-2 mb-8 gap-2 border-b border-slate-200 dark:border-slate-800 jemer-premium-scroll touch-pan-x">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            // Upgraded padding and border styles for a cleaner tab layout
            className={`px-5 py-3 border-b-[3px] font-bold text-sm whitespace-nowrap transition-colors focus:outline-none ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── DYNAMIC TAB CONTENT AREA ── */}
      {/* Scaffolding containers explicitly built for easy backend data injection[cite: 2] */}
      <div className="min-h-[500px] w-full animate-fade-in relative">
        
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          // Adjusted max-width and text leading for optimal readability
          <div className="w-full prose prose-slate dark:prose-invert max-w-4xl text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            <p className="font-medium">
              This lecture delves into the foundational mechanics of structural system entropy. It begins by evaluating the Second Law Parameter and its direct correlation to thermal input weights. The professor emphasizes that to suppress system entropy escalations, one must rigorously map geometric node alignments within isolated conversion envelopes.
            </p>
            {/* Upgraded Blockquote with deeper shadows and better rounding */}
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-5 py-4 rounded-r-2xl italic font-medium text-slate-800 dark:text-slate-200 my-6 shadow-md">
              "When matter undergoes conversion limits, the geometric alignment of system nodes dictates total heat capacity."
            </blockquote>
          </div>
        )}

        {/* FULL NOTES TAB */}
        {activeTab === "raw_notes" && (
          // Upgraded to a 3xl rounded card with smooth interior shadow
          <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Lecture Notes: Thermodynamic Boundaries</h1>
              
              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-8 mb-4">1. Core Concepts</h3>
              <ul className="space-y-2 mb-6">
                <li><strong>Entropy:</strong> Serves as the mathematical metric tracking molecular disorder within an isolated system.</li>
                <li><strong>Enthalpy:</strong> The total heat content of a system, dictating thermal energy flow.</li>
              </ul>

              <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-8 mb-4">2. Formula Breakdown</h3>
              <div className="bg-slate-900 rounded-xl p-4 my-4 overflow-x-auto text-white shadow-md border border-slate-700">
                <code className="font-mono text-sm">ΔS_universe = ΔS_system + ΔS_surroundings &ge; 0</code>
              </div>
              <p>The equation above demonstrates that natural thermodynamic sequences always move toward an escalated boundary of state chaos.</p>
            </div>
          </div>
        )}

        {/* INTERACTIVE QUIZ TAB */}
        {activeTab === "quiz" && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upgraded Quiz Card UI */}
            <div className="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="font-bold text-slate-900 dark:text-white text-lg mb-5">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">Q1.</span> 
                What dictates the total heat capacity when matter undergoes conversion limits?
              </p>
              <div className="grid gap-3">
                <button className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full border border-slate-300 dark:border-slate-500 flex items-center justify-center text-xs font-bold mr-3 shrink-0">A</span>
                  Molecular mass alignment
                </button>
                {/* Active/Correct State Button */}
                <button className="w-full text-left p-4 rounded-2xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold transition-colors flex items-center shadow-sm">
                  <span className="inline-block w-8 h-8 rounded-full border-2 border-emerald-500 flex items-center justify-center text-xs mr-3 shrink-0">B</span>
                  Geometric alignment of system nodes
                  {/* Replaced FontAwesome with native SVG Check */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-auto"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <button className="w-full text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center">
                  <span className="inline-block w-8 h-8 rounded-full border border-slate-300 dark:border-slate-500 flex items-center justify-center text-xs font-bold mr-3 shrink-0">C</span>
                  Velocity of external forces
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KEY POINTS TAB */}
        {activeTab === "key_points" && (
          <div className="space-y-4 max-w-4xl">
            {/* Key Point Entry 1 */}
            <div className="flex gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                {/* Native SVG Bulb Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2">
                System entropy naturally escalates; suppressing it requires crossing thermal threshold resistances.
              </p>
            </div>
            {/* Key Point Entry 2 */}
            <div className="flex gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm items-start">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                {/* Native SVG Bulb Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2">
                The Second Law Parameter is the absolute boundary that dictates state chaos sequences.
              </p>
            </div>
          </div>
        )}

        {/* ACTION ITEMS TAB */}
        {activeTab === "action_items" && (
          <div className="space-y-4 max-w-4xl">
             <div className="flex gap-4 bg-white dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                {/* Native SVG Check Square Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed mt-2">
                Review chapter 4 on geometric node alignments before the next lab session.
              </p>
            </div>
          </div>
        )}

        {/* TRANSCRIPT (TIMELINE) TAB */}
        {/* Preserved the visual scaffolding from Stage 5[cite: 2] */}
        {activeTab === "transcript" && (
          <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              
              {/* Timeline Entry 1 */}
              <div className="flex flex-col sm:flex-row gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="shrink-0 pt-1">
                  {/* Upgraded to rounded-xl for consistency */}
                  <button className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-mono font-bold text-xs transition-all border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                    00:00
                  </button>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-base mt-1 sm:mt-0">
                  Welcome class. Today we are looking at the fundamental laws governing system thermodynamics and entropy.
                </div>
              </div>

              {/* Timeline Entry 2 */}
              <div className="flex flex-col sm:flex-row gap-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="shrink-0 pt-1">
                  <button className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-mono font-bold text-xs transition-all border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
                    01:45
                  </button>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-base mt-1 sm:mt-0">
                  If you look closely at the Second Law parameter, you'll see that any natural thermodynamic sequence will inexorably move toward an escalated boundary of state chaos.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}