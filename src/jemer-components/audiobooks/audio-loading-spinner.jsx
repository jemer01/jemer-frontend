/**
 * [NEW]
 * SUMMARY: Phase 2 UI/UX Mind-Blowing Loading Matrix
 * 1. AI Neural Core Redesign: Completely replaced the basic waveform with a 3D-styled, CSS-animated "Neural Core" consisting of orbiting rings and a pulsing plasma center.
 * 2. Terminal Progress Interface: Upgraded the dynamic status text into a glowing terminal-style readout that feels like a supercomputer processing data.
 * 3. Strict Logic Preservation: Maintained the `processingSteps` state array and the `useEffect` interval logic that cycles exactly every 1500ms to simulate the backend steps.
 * ================================================================================================
 * ⏳ JEMER ACADEMY DESIGN SYSTEM — AUDIO LOADING ENGINE (v3.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";

export default function AudioLoadingSpinner() {
  // ── DYNAMIC PROCESSING TEXT STATES (Logic Preserved) ──
  const processingSteps = [
    "Analyzing audio frequencies...",
    "Extracting vocal transcriptions...",
    "Filtering background noise...",
    "Synthesizing core concepts...",
    "Formatting structured study notes...",
    "Finalizing AI output..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Cycle the text every 1.5 seconds (Logic Preserved)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex === processingSteps.length - 1) return prevIndex;
        return prevIndex + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [processingSteps.length]);

  // Calculate a fake progress percentage to make the UI feel alive
  const progressPercentage = Math.min(100, Math.floor(((currentStepIndex + 1) / processingSteps.length) * 100));

  return (
    <div className="w-full flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-fade-in p-6 bg-slate-50/30 dark:bg-slate-950/30">
      
      {/* 🚀 CSS INJECTION: AI Neural Core Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rotate-x {
          0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(0deg) rotateZ(360deg); }
        }
        @keyframes rotate-y {
          0% { transform: rotateX(60deg) rotateY(45deg) rotateZ(360deg); }
          100% { transform: rotateX(60deg) rotateY(45deg) rotateZ(0deg); }
        }
        @keyframes rotate-z {
          0% { transform: rotateX(60deg) rotateY(-45deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(-45deg) rotateZ(360deg); }
        }
        @keyframes neural-pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.8; box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 60px rgba(99, 102, 241, 0.9), 0 0 100px rgba(168, 85, 247, 0.6); }
        }
        
        .orbit-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid transparent;
          transform-style: preserve-3d;
        }
        .orbit-1 { border-top: 2px solid #6366f1; border-bottom: 2px solid #6366f1; animation: rotate-x 4s linear infinite; }
        .orbit-2 { border-left: 2px solid #a855f7; border-right: 2px solid #a855f7; animation: rotate-y 6s linear infinite; }
        .orbit-3 { border-top: 2px solid #3b82f6; border-bottom: 2px solid #3b82f6; animation: rotate-z 8s linear infinite; }
      `}} />

      <div className="w-full max-w-lg flex flex-col items-center justify-center">
        
        {/* ── THE NEURAL CORE VISUALIZER ── */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-12 flex items-center justify-center perspective-[1000px]">
          {/* Orbital Rings */}
          <div className="orbit-ring orbit-1 shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]"></div>
          <div className="orbit-ring orbit-2 shadow-[inset_0_0_20px_rgba(168,85,247,0.2)]"></div>
          <div className="orbit-ring orbit-3 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]"></div>
          
          {/* Inner Glowing Plasma Core */}
          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full neural-pulse flex items-center justify-center overflow-hidden">
             {/* Core texture effect */}
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>
          </div>
        </div>

        {/* ── TERMINAL PROGRESS DISPLAY ── */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Terminal Scanline Overlay Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>

          <div className="flex justify-between items-center mb-4 relative z-10">
            <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              System Processing
            </h2>
            <span className="text-xs font-mono font-bold text-indigo-400">{progressPercentage}%</span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-5 relative z-10">
             <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all duration-1000 ease-in-out" 
                style={{ width: `${progressPercentage}%`, backgroundSize: '200% 100%', animation: 'pulse-bg 2s linear infinite' }}
             ></div>
          </div>

          {/* Dynamic Status Text Window */}
          <div className="bg-slate-950 rounded-lg p-4 border border-slate-800/50 relative z-10">
             <p className="text-xs font-mono text-slate-400 mb-1 opacity-50">› STATUS:</p>
             <div className="h-6 flex items-center">
               <p 
                 key={currentStepIndex} 
                 className="text-sm font-mono font-bold text-emerald-400 animate-slide-up"
               >
                 {processingSteps[currentStepIndex]}
                 <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle"></span>
               </p>
             </div>
          </div>

        </div>

      </div>

    </div>
  );
}