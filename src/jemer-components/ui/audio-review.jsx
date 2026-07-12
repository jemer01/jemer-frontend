/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Custom Audio Review Matrix.
 * 1. Custom Playback Engine: Completely hid the native HTML5 `<audio>` element. Built a highly reactive, custom-styled player with interactive progress tracking, play/pause SVGs, and live timestamp formatting.
 * 2. Premium UI Polish: Implemented deep glassmorphism (`backdrop-blur-xl`), intense gradients, and heavy drop shadows to make the review card feel like a native iOS media player.
 * 3. Strict Compliance: Explicitly ensured no "Pro" or "Budget" badges are rendered. The UI is 100% focused on audio playback and action routing (Discard vs Generate).
 * ================================================================================================
 * 🎧 JEMER ACADEMY DESIGN SYSTEM — AUDIO REVIEW ENGINE (v1.0)
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
  const progressBarRef = useRef(null);

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

  // Allow users to click the timeline to skip around
  const handleProgressClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
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
    <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4 animate-fade-in">
      
      {/* ── INVISIBLE AUDIO NODE ── */}
      {/* We use this to process the file, but we control it entirely via React state */}
      <audio
        ref={audioRef}
        src={audioData?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        className="hidden"
      />

      <div className="w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* ── HEADER ── */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest font-mono">
            Review Audio
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2.5 py-1 rounded-md border border-purple-100 dark:border-purple-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Ready for Processing
          </div>
        </div>

        {/* ── CUSTOM PLAYER UI ── */}
        <div className="p-8 flex flex-col items-center gap-6">
          
          {/* File Identity */}
          <div className="text-center space-y-2 w-full">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/40 dark:to-indigo-900/20 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-purple-200/50 dark:border-purple-700/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music text-purple-500 dark:text-purple-400">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            {/* The truncate class ensures long filenames don't break the layout */}
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white truncate px-4">
              {audioData?.name || "Audio Recording"}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {(audioData?.size / 1024 / 1024).toFixed(2)} MB • HQ Audio
            </p>
          </div>

          {/* Interactive Timeline Matrix */}
          <div className="w-full space-y-2">
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group"
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-100 ease-linear"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Master Play Control */}
          <button 
            onClick={togglePlayPause}
            className="w-16 h-16 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-slate-900/20 dark:shadow-white/10"
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pause">
                <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play translate-x-0.5">
                <polygon points="6 3 20 12 6 21 6 3"/>
              </svg>
            )}
          </button>

        </div>

        {/* ── ACTION GRID ── */}
        <div className="grid grid-cols-2 gap-3 p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <button 
            onClick={onDiscard}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/50 transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            <span>Discard</span>
          </button>
          
          <button 
            onClick={onGenerate}
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-purple-500/30 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            <span>Generate Notes</span>
          </button>
        </div>

      </div>
    </div>
  );
}