"use client";

/**
 * ================================================================================================
 * 🆕 NEW UPGRADES SUMMARY (v1.3 - STUDY ROOM DYNAMIC INTEGRATION)
 * ================================================================================================
 * 1. EDTECH PURPLE THEMING: Added `isStudyMode` checks. The HUD radar rings, progress bars, 
 *    and glowing auras now switch to a deep Purple/Fuchsia theme when `mode="study"`.
 * 2. 4-WAY DYNAMIC THEMING: Upgraded `themeStyles` to gracefully handle JAMB (Green), 
 *    WAEC (Blue), Practice (Orange), and the new Study Room (Purple) seamlessly.
 * 3. DYNAMIC STATUS MESSAGES: Added a `study` array to `STATUS_STEPS` containing active-learning 
 *    focused terminology ("Pre-loading AI explanation modules...", etc.).
 * 4. LOGIC PRESERVED: Core interval timer, percentile benchmarks, and completion triggers remain 
 *    100% identical.
 * ================================================================================================
 */

import React, { useState, useEffect, useMemo } from "react";

const STATUS_STEPS = {
  jamb: [
    "Connecting to Jemer High-Speed UTME Question Engine...",
    "Shuffling questions across selected subject combinations...",
    "Calibrating official 120-minute CBT countdown timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  waec: [
    "Connecting to Jemer High-Speed WASSCE Question Engine...",
    "Shuffling questions across selected subject combinations...",
    "Calibrating official WASSCE countdown timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  practice: [
    "Connecting to Jemer Practice Engine...",
    "Loading custom practice parameters...",
    "Calibrating practice session timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing exam workspace!",
  ],
  study: [
    "Initializing Study Room Engine...",
    "Pre-loading AI explanation modules...",
    "Calibrating active learning session timer...",
    "Encrypting candidate session token & loading question matrix...",
    "Finalizing interface... Preparing study workspace!",
  ]
};

const MOTIVATIONAL_QUOTES = [
  "“Success is where preparation and opportunity meet.”",
  "“You have practiced, you are prepared. Stay calm and focused!”",
  "“Trust your instincts and read every question stem carefully.”",
  "“Speed and accuracy win the game. You’ve got this!”",
];

export default function ExamLoadingSpinner({ mode = "jamb", config, onComplete }) {
  const isWaecMode = mode === "waec";
  const isPracticeMode = mode === "practice";
  const isStudyMode = mode === "study";

  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const activeQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
  }, []);

  const activeStatusSteps = isStudyMode 
    ? STATUS_STEPS.study
    : isPracticeMode 
      ? STATUS_STEPS.practice 
      : isWaecMode 
        ? STATUS_STEPS.waec 
        : STATUS_STEPS.jamb;

  // Derive dynamic classes based on mode to keep JSX clean
  const themeStyles = useMemo(() => {
    if (isStudyMode) {
      return {
        ringBg: "bg-purple-500/10 dark:bg-purple-500/20",
        dottedRing: "border-purple-500/40",
        innerRing: "border-t-purple-500 border-r-fuchsia-400",
        textAccent: "text-purple-600 dark:text-purple-400",
        gradientBar: "from-purple-500 via-fuchsia-500 to-purple-400",
        borderAccent: "border-purple-500/20",
        bgAccent: "bg-purple-500/10"
      };
    }
    if (isPracticeMode) {
      return {
        ringBg: "bg-orange-500/10 dark:bg-orange-500/20",
        dottedRing: "border-orange-500/40",
        innerRing: "border-t-orange-500 border-r-amber-400",
        textAccent: "text-orange-600 dark:text-orange-400",
        gradientBar: "from-orange-500 via-amber-500 to-orange-400",
        borderAccent: "border-orange-500/20",
        bgAccent: "bg-orange-500/10"
      };
    }
    if (isWaecMode) {
      return {
        ringBg: "bg-blue-500/10 dark:bg-blue-500/20",
        dottedRing: "border-blue-500/40",
        innerRing: "border-t-blue-500 border-r-indigo-400",
        textAccent: "text-blue-600 dark:text-blue-400",
        gradientBar: "from-blue-500 via-indigo-500 to-blue-400",
        borderAccent: "border-blue-500/20",
        bgAccent: "bg-blue-500/10"
      };
    }
    return {
      ringBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      dottedRing: "border-emerald-500/40",
      innerRing: "border-t-emerald-500 border-r-teal-400",
      textAccent: "text-emerald-600 dark:text-emerald-400",
      gradientBar: "from-emerald-500 via-teal-500 to-emerald-400",
      borderAccent: "border-emerald-500/20",
      bgAccent: "bg-emerald-500/10"
    };
  }, [isPracticeMode, isWaecMode, isStudyMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }

        const nextProgress = prev + 1;
        if (nextProgress === 20) setStatusIndex(1);
        if (nextProgress === 45) setStatusIndex(2);
        if (nextProgress === 75) setStatusIndex(3);
        if (nextProgress === 92) setStatusIndex(4);

        return nextProgress;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 flex flex-col items-center justify-center space-y-8 text-center animate-fade-in">
      
      {/* CENTRAL HUD RADAR ANIMATION */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full animate-ping ${themeStyles.ringBg}`} />
        <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-[spin_8s_linear_infinite] ${themeStyles.dottedRing}`} />
        <div className={`absolute inset-3 rounded-full border-2 border-b-transparent border-l-transparent animate-[spin_3s_linear_infinite] ${themeStyles.innerRing}`} />

        <div className="relative w-32 h-32 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-display font-black text-slate-900 dark:text-white font-mono">
            {progress}%
          </span>
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeStyles.textAccent}`}>
            Pre-Check
          </span>
        </div>
      </div>

      {/* PROGRESS BAR & DYNAMIC STATUS TEXT */}
      <div className="w-full space-y-3 max-w-md">
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/50 dark:border-slate-700/50">
          <div
            className={`h-full rounded-full transition-all duration-150 ease-out shadow-sm bg-gradient-to-r ${themeStyles.gradientBar}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="h-6 flex items-center justify-center">
          <p className="text-xs sm:text-sm font-mono font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {activeStatusSteps[statusIndex]}
          </p>
        </div>
      </div>

      {/* EXAM SESSION PREVIEW BADGES & MOTIVATIONAL WIDGET */}
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {config?.subjects?.map((sub) => (
            <span
              key={sub.id}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {sub.name} ({sub.count}Q)
            </span>
          ))}
          <span className={`px-3 py-1 rounded-xl border text-xs font-black font-mono ${themeStyles.bgAccent} ${themeStyles.textAccent} ${themeStyles.borderAccent}`}>
            ⏱️ {config?.durationMinutes || 120} Mins
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-slate-300 shadow-md">
          <p className={`text-xs sm:text-sm font-medium italic ${themeStyles.textAccent.replace("text-", "text-").split(" ")[0]}`}>
            {activeQuote}
          </p>
        </div>
      </div>

    </div>
  );
}