/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.1 Action Buttons Hotfix.
 * 1. Routing Clarity Fix: Replaced the "Discard" button with a clear "Cancel" button featuring a back arrow (`fa-arrow-left`). This explicitly tells the user it routes back to the Record intro stage without any destructive ambiguity.
 * 2. Process Button Confirmation: Ensured the right button is explicitly labeled "Process" and triggers the dummy AI loading sequence (`onGenerate`) perfectly.
 * ================================================================================================
 * 🎧 JEMER ACADEMY DESIGN SYSTEM — AUDIO REVIEW ENGINE (v2.1)
 * ================================================================================================
 */

"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AudioReview({ audioData, onDiscard, onGenerate }) {
  // ── PLAYBACK STATE ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // ── DOM REFS ──
  const audioRef = useRef(null);

  // Auto-play the audio slightly after mount to engage the user
  useEffect(() => {
    if (audioRef.current) {
      // Small timeout ensures the browser has buffered enough to play smoothly
      const playTimer = setTimeout(() => {
        audioRef.current.play().catch(e => console.log("Autoplay prevented by browser:", e));
        setIsPlaying(true);
      }, 500);
      return () => clearTimeout(playTimer);
    }
  }, []);

  // Play/Pause Controller
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Sync state with HTML audio node
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Capture total duration once metadata loads
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Reset play state when audio finishes naturally
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // 🚀 NEW UPGRADE: Smooth Drag-to-Seek Logic using Range Input
  const handleSeek = (e) => {
    const seekPercentage = e.target.value;
    const newTime = (seekPercentage / 100) * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  // Time Formatter (MM:SS)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 lg:p-12 animate-fade-in bg-slate-50 dark:bg-[#0A0A0A] rounded-[2rem] shadow-inner relative overflow-hidden">
      
      {/* 🚀 CSS INJECTION: Custom Pro Scrubber & Glows */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Premium Range Slider Styling */
        .audio-scrubber {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 99px;
          outline: none;
          cursor: pointer;
          position: relative;
          z-index: 10;
        }
        .dark .audio-scrubber { background: rgba(255, 255, 255, 0.1); }
        
        .audio-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          border: 2px solid #6366f1;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          transition: transform 0.1s;
        }
        .audio-scrubber::-webkit-slider-thumb:hover { transform: scale(1.2); }
        
        .audio-scrubber::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          border: 2px solid #6366f1;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          transition: transform 0.1s;
        }
        .audio-scrubber::-moz-range-thumb:hover { transform: scale(1.2); }
      `}} />

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* ── INVISIBLE AUDIO NODE ── */}
      <audio
        ref={audioRef}
        src={audioData?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        className="hidden"
      />

      {/* 🏛️ MASTER GLASSMORPHIC CONTAINER */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-700/60 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative z-10">
        
        {/* Inner glow ring for extra depth */}
        <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/50 dark:ring-white/10 pointer-events-none"></div>

        {/* ── HEADER ── */}
        <div className="px-8 py-5 border-b border-slate-100/50 dark:border-slate-800/50 flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">
            Review Recording
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Ready
          </div>
        </div>

        {/* ── CUSTOM PLAYER UI ── */}
        <div className="px-8 pt-8 pb-10 flex flex-col items-center gap-8">
          
          {/* File Identity & Icon */}
          <div className="text-center space-y-3 w-full">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-indigo-500/30 ring-2 ring-white/20 dark:ring-white/10 transform rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-radio">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/>
              </svg>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-display font-black text-slate-900 dark:text-white truncate px-2 leading-tight">
              {audioData?.name || "Audio Recording"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
              {(audioData?.size / 1024 / 1024).toFixed(2)} MB • HQ Audio
            </p>
          </div>

          {/* Interactive Native Timeline Scrubber */}
          <div className="w-full space-y-3">
            <div className="relative w-full h-6 flex items-center group">
              {/* Dynamic filled track background */}
              <div 
                className="absolute left-0 h-[6px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full z-0 pointer-events-none"
                style={{ width: `${progressPercentage}%` }}
              />
              <input 
                type="range"
                min="0"
                max="100"
                value={progressPercentage || 0}
                onChange={handleSeek}
                className="audio-scrubber"
              />
            </div>
            
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
              <span className="text-indigo-600 dark:text-indigo-400">{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Master Play Control */}
          <button 
            onClick={togglePlayPause}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-xl border-4 border-white/50 dark:border-slate-700/50 ${
              isPlaying 
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-indigo-500/20" 
                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30"
            }`}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play translate-x-1">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            )}
          </button>

        </div>

        {/* ── ACTION PILLS GRID ── */}
        <div className="grid grid-cols-2 gap-4 px-8 pb-8">
          {/* Cancel/Back Button */}
          <button 
            onClick={onDiscard}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
          >
            <i className="fas fa-arrow-left opacity-70"></i>
            <span>Cancel</span>
          </button>
          
          {/* Process Button */}
          <button 
            onClick={onGenerate}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[11px] uppercase tracking-wider shadow-lg hover:shadow-xl dark:shadow-white/10 transition-all active:scale-95"
          >
            <span>Process</span>
            <i className="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>

      </div>
    </div>
  );
}