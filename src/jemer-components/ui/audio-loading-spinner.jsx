/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 AI Audio Loading Matrix.
 * 1. Mind-Blowing Visuals: Completely abandoned the traditional spinning circle. Engineered a custom CSS `@keyframes` audio waveform that pulses dynamically, matching the exact aesthetic of an AI processing sound.
 * 2. Dynamic Text Cycling: Implemented a `useEffect` interval that cleanly cycles through professional extraction phases (e.g., "Extracting vocals...", "Synthesizing notes..."). This drastically reduces perceived wait time and keeps the user immersed.
 * ================================================================================================
 * ⏳ JEMER ACADEMY DESIGN SYSTEM — AUDIO LOADING ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

export default function AudioLoadingSpinner() {
  // ── DYNAMIC PROCESSING TEXT STATES ──
  const processingSteps = [
    "Analyzing audio frequencies...",
    "Extracting vocal transcriptions...",
    "Filtering background noise...",
    "Synthesizing core concepts...",
    "Formatting structured study notes...",
    "Finalizing AI output..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Cycle the text every 1.5 seconds to simulate complex backend processing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        // Stop advancing if we hit the final step before the component unmounts
        if (prevIndex === processingSteps.length - 1) return prevIndex;
        return prevIndex + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [processingSteps.length]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] animate-fade-in p-6">
      
      {/* 🚀 CSS INJECTION: Custom AI Waveform Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes waveform {
          0% { transform: scaleY(0.2); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0.2); opacity: 0.5; }
        }
        .wave-bar {
          width: 6px;
          border-radius: 99px;
          background: linear-gradient(to top, #8b5cf6, #6366f1);
          animation: waveform 1s ease-in-out infinite;
          transform-origin: bottom;
        }
        .dark .wave-bar {
          background: linear-gradient(to top, #a78bfa, #818cf8);
        }
        .wave-1 { animation-delay: 0.0s; height: 32px; }
        .wave-2 { animation-delay: 0.1s; height: 48px; }
        .wave-3 { animation-delay: 0.2s; height: 64px; }
        .wave-4 { animation-delay: 0.3s; height: 80px; }
        .wave-5 { animation-delay: 0.4s; height: 64px; }
        .wave-6 { animation-delay: 0.5s; height: 48px; }
        .wave-7 { animation-delay: 0.6s; height: 32px; }
      `}} />

      <div className="w-full max-w-sm flex flex-col items-center justify-center text-center">
        
        {/* ── THE WAVEFORM VISUALIZER ── */}
        <div className="flex items-end justify-center gap-1.5 h-24 mb-10">
          <div className="wave-bar wave-1"></div>
          <div className="wave-bar wave-2"></div>
          <div className="wave-bar wave-3"></div>
          <div className="wave-bar wave-4"></div>
          <div className="wave-bar wave-5"></div>
          <div className="wave-bar wave-6"></div>
          <div className="wave-bar wave-7"></div>
        </div>

        {/* ── DYNAMIC STATUS TEXT ── */}
        <div className="space-y-3 w-full">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Processing Audio
          </h2>
          
          {/* We use key={} to force React to re-render the animation when the text changes */}
          <div className="h-8 flex items-center justify-center">
             <p 
               key={currentStepIndex} 
               className="text-xs font-mono font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 animate-slide-up"
             >
               {processingSteps[currentStepIndex]}
             </p>
          </div>
          
          {/* Static progress bar mock representing continuous loading */}
          <div className="w-full max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mx-auto mt-4">
             <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full w-1/2 animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '100%', transformOrigin: 'left', animation: 'scale-x 2s infinite alternate' }}></div>
          </div>
        </div>

      </div>

    </div>
  );
}