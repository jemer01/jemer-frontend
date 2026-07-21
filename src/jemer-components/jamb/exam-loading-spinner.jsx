"use client"; // Enforces client-side rendering for timer intervals, dynamic progress state, and animations

/**
 * ================================================================================================
 * 🆕 COMPONENT SUMMARY: HIGH-ENGAGEMENT PRE-CHECK EXAM LOADING SPINNER (v1.0)
 * ================================================================================================
 * 1. REAL-TIME PROGRESS SIMULATION: Runs a smooth micro-step timer advancing progress from 0% to 100%.
 * 2. FLIGHT PRE-CHECK TICKER: Displays sequential status messages (e.g., shuffling questions, calibrating timers)
 *    to give candidates a high-tech, authentic CBT portal feel.
 * 3. MOTIVATIONAL CONFIDENCE BOOSTER: Displays inspirational messages that cycle during loading to prepare candidates mentally.
 * 4. AUTOMATIC TRANSITION: Automatically triggers the `onComplete` callback as soon as progress reaches 100%.
 * ================================================================================================
 */

// Import React core hooks for lifecycle management and dynamic state
import React, { useState, useEffect, useMemo } from "react";

/**
 * PRE-FLIGHT STATUS MESSAGES ARRAY
 * Sequential technical messages rendered during the prep phase.
 */
const STATUS_STEPS = [
  "Connecting to Jemer High-Speed UTME Question Engine...",
  "Shuffling questions across selected subject combinations...",
  "Calibrating official 120-minute CBT countdown timer...",
  "Encrypting candidate session token & loading question matrix...",
  "Finalizing interface... Preparing exam workspace!",
];

/**
 * MOTIVATIONAL QUOTES ARRAY
 * High-energy confidence boosters rotated during portal initialization.
 */
const MOTIVATIONAL_QUOTES = [
  "“Success is where preparation and opportunity meet.”",
  "“You have practiced, you are prepared. Stay calm and focused!”",
  "“Trust your instincts and read every question stem carefully.”",
  "“Speed and accuracy win the game. You’ve got this!”",
];

/**
 * ExamLoadingSpinner Component
 * 
 * @param {Object} props
 * @param {string} props.mode - Exam mode identifier (defaults to 'jamb')
 * @param {Object} props.config - Stored user setup options from Stage 1 (subjects, questions, timer, year)
 * @param {Function} props.onComplete - Callback fired when progress reaches 100% to enter Stage 3
 */
export default function ExamLoadingSpinner({ mode = "jamb", config, onComplete }) {
  // State 1: Numerical progress integer ranging from 0 to 100
  const [progress, setProgress] = useState(0);

  // State 2: Index tracking current active status step message
  const [statusIndex, setStatusIndex] = useState(0);

  // Memoized randomly selected motivational quote for this loading session
  const activeQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  /**
   * TIMER EFFECT:
   * Sets up a high-frequency interval that increments progress and advances status messages.
   */
  useEffect(() => {
    // Set up timer interval running every 35 milliseconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        // If progress reaches 100%, clear timer and trigger completion callback
        if (prev >= 100) {
          clearInterval(interval);
          // Small delay before invoking parent complete trigger for smooth visual transition
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }

        // Calculate next incremental progress value
        const nextProgress = prev + 1;

        // Dynamically update status text index based on progress percentile benchmarks
        if (nextProgress === 20) setStatusIndex(1);
        if (nextProgress === 45) setStatusIndex(2);
        if (nextProgress === 75) setStatusIndex(3);
        if (nextProgress === 92) setStatusIndex(4);

        return nextProgress;
      });
    }, 35);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    // Outer canvas wrapper centered vertically and horizontally
    <div className="w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center space-y-8 text-center animate-fade-in">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          CENTRAL HUD RADAR ANIMATION (Concentric Glowing Rings)
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Outer Pulsing Aura Ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 animate-ping" />

        {/* Outer Rotating Dotted Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/40 animate-[spin_8s_linear_infinite]" />

        {/* Inner Counter-Rotating Gradient Ring */}
        <div className="absolute inset-3 rounded-full border-2 border-t-emerald-500 border-r-teal-400 border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite]" />

        {/* Inner Glass Center Disc showing Numerical Percentage */}
        <div className="relative w-32 h-32 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-display font-black text-slate-900 dark:text-white font-mono">
            {progress}%
          </span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Pre-Check
          </span>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          PROGRESS BAR & DYNAMIC STATUS TEXT
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full space-y-3 max-w-md">
        
        {/* Progress Bar Track */}
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-slate-700/50">
          {/* Animated Fill Bar */}
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Ticker Message */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs sm:text-sm font-mono font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {STATUS_STEPS[statusIndex]}
          </p>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          EXAM SESSION PREVIEW BADGES & MOTIVATIONAL WIDGET
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full space-y-4">
        
        {/* Selected Configuration Metadata Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {config?.subjects?.map((sub) => (
            <span
              key={sub.id}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {sub.name} ({sub.count}Q)
            </span>
          ))}
          <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black font-mono">
            ⏱️ {config?.durationMinutes || 120} Mins
          </span>
        </div>

        {/* Motivational Booster Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-slate-300 shadow-md">
          <p className="text-xs sm:text-sm font-medium italic text-emerald-300">
            {activeQuote}
          </p>
        </div>

      </div>

    </div>
  );
}