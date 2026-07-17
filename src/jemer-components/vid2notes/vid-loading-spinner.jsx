/**
 * ================================================================================================
 * 🎥 JEMER ACADEMY DESIGN SYSTEM — VIDEO LOADING SPINNER
 * ================================================================================================
 * SUMMARY: Fixed JSX Parsing & Build Errors.
 * 1. Structural Integrity Fix: Added the missing `</div>` to close the `play-pulse` container.
 * 2. Documentation: Added heavy comments across the file to explain state, hooks, and UI geometry.
 * 3. Strict Compliance: Maintained all your original Tailwind classes, animations, and intervals.
 */

"use client"; // Required in Next.js App Router for components using state and lifecycle hooks

// Import React and necessary hooks for state and side effects
import React, { useState, useEffect } from "react";

export default function VidLoadingSpinner() {
  // ==========================================
  // STATE & DATA
  // ==========================================
  
  // Array of processing steps to show the user while the AI works in the background
  const processingSteps = [
    "Analyzing video stream...",
    "Extracting audio track...",
    "Transcribing captions & speech...",
    "Detecting key scenes...",
    "Synthesizing core concepts...",
    "Formatting structured study notes...",
    "Finalizing AI output..."
  ];
  
  // State to track which step we are currently displaying to the user
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // ==========================================
  // LIFECYCLE EFFECTS
  // ==========================================
  
  // useEffect to cycle through the processing steps automatically
  useEffect(() => {
    // Set up an interval that fires every 1.5 seconds (1500ms)
    const interval = setInterval(() => {
      // Update the current step index safely using the previous state
      // If we hit the last step, stay there (don't loop back to the beginning)
      setCurrentStepIndex((prev) => prev === processingSteps.length - 1 ? prev : prev + 1);
    }, 1500);
    
    // Cleanup function to clear the interval if the component unmounts
    // This prevents memory leaks and background ghost processes
    return () => clearInterval(interval);
  }, [processingSteps.length]);

  // ==========================================
  // UI RENDER BLOCK
  // ==========================================

  return (
    // Master container: Centers everything on the screen with a minimum height
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] animate-fade-in p-6">
      
      {/* 
        Dynamic CSS injections for custom keyframe animations.
        Using dangerouslySetInnerHTML allows us to write raw CSS directly into the component.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes vid-frame-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 12px rgba(239,68,68,0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes scan-line { 0% { top: 0%; opacity: 1; } 100% { top: 100%; opacity: 0; } }
        @keyframes play-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
       .vid-frame { animation: vid-frame-pulse 2s ease-in-out infinite; }
       .scan-line { animation: scan-line 2s linear infinite; }
       .play-pulse { animation: play-pulse 1.5s ease-in-out infinite; }
      `}} />

      {/* Main content wrapper */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center text-center">
        
        {/* ── MOCK VIDEO PLAYER (THE SPINNER) ── */}
        <div className="relative w-72 h-40 mb-10 vid-frame rounded-[1.5rem] overflow-hidden bg-slate-900 border-2 border-red-500/20 shadow-[0_20px_60px_-15px_rgba(239,68,68,0.3)]">
          
          {/* Dark gradient background for the video frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black"></div>
          
          {/* Animated red scanning line effect */}
          <div className="scan-line absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          
          {/* Pulsing Play Button Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 play-pulse">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
              {/* Play icon SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="translate-x-0.5">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            </div>
          </div> {/* 🚀 THE FIX: This closing div was missing! Now the play button is properly contained. */}

          {/* Fake Video Progress Bar at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div className="h-full w-1/2 bg-gradient-to-r from-red-500 to-rose-500 rounded-full relative overflow-hidden">
              {/* Shimmer effect inside the progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 animate-[shimmer_1.5s_linear_infinite]"></div>
            </div>
          </div>
          
          {/* Top Left Badge: YOUTUBE */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-md font-mono">
            YOUTUBE
          </div>
          
          {/* Top Right Badge: REC with pulsing red dot */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></span>
            REC
          </div>
          
        </div>

        {/* ── AUDIO EQUALIZER ANIMATION ── */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          <div className="w-8 h-1.5 rounded-full bg-red-500/60 animate-pulse"></div>
          <div className="w-12 h-1.5 rounded-full bg-red-500 animate-pulse delay-75"></div>
          <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-500 animate-pulse delay-150"></div>
          <div className="w-12 h-1.5 rounded-full bg-red-500 animate-pulse delay-75"></div>
          <div className="w-8 h-1.5 rounded-full bg-red-500/60 animate-pulse"></div>
        </div>

        {/* ── TEXT PROCESSING STATUS ── */}
        <div className="space-y-3 w-full">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Processing Video</h2>
          
          {/* Dynamic text changing based on the interval step index */}
          <div className="h-8 flex items-center justify-center">
            <p key={currentStepIndex} className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400 animate-slide-up">
              {processingSteps[currentStepIndex]}
            </p>
          </div>
          
          {/* Bottom generic loading bar */}
          <div className="w-full max-w-xs h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mx-auto mt-4">
            <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full w-full animate-pulse"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}