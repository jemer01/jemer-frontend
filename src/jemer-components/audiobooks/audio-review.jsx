/**
 * [NEW]
 * SUMMARY: Phase 2 UI/UX Playback & Review Upgrade
 * 1. Custom Audio Player: Replaced the default HTML `<audio controls>` with a stunning, fully custom React audio player. Features a custom CSS scrubber, play/pause, skip backward/forward 10s, and dynamic time tracking.
 * 2. Mobile Layout Fix: Upgraded the flexbox structure so the Discard and Generate buttons securely stack on mobile devices and span 100% width, preventing them from ever disappearing off-screen.
 * 3. SVG Rendering Fix: Replaced buggy font-icons with explicit, Next.js-compliant inline SVGs for perfect rendering.
 * 4. Strict Logic Preservation: Maintained the crucial `typeof` and `instanceof Blob` logic to prevent the `createObjectURL` Overload TypeError.
 * ================================================================================================
 * 🎧 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS REVIEW (v3.0)
 * ================================================================================================
 */

"use client";

import React, { useEffect, useState, useRef } from "react";

export default function AudioReview({ audioData, onDiscard, onGenerate }) {
  // ── CORE LOGIC STATES ──
  const [audioUrl, setAudioUrl] = useState(null);

  // ── CUSTOM PLAYER STATES ──
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Safely generate a browser-playable URL or use the existing string payload
  useEffect(() => {
    if (audioData) {
      if (typeof audioData === "string") {
        setAudioUrl(audioData);
        return;
      }
      if (audioData instanceof Blob || audioData instanceof File) {
        try {
          const url = URL.createObjectURL(audioData);
          setAudioUrl(url);
          return () => URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Audio playback initialization failed:", error);
        }
      } else {
        console.warn("AudioReview received invalid audioData format:", audioData);
      }
    }
  }, [audioData]);

  // ── CUSTOM PLAYER LOGIC ──
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (amount) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += amount;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-[calc(100vh-100px)] p-4 sm:p-6 animate-fade-in">
      
      {/* 🚀 CSS INJECTION: Custom Range Slider Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: transparent;
          outline: none;
          border-radius: 99px;
        }
        .custom-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: rgba(99, 102, 241, 0.2);
          border-radius: 99px;
        }
        .dark .custom-slider::-webkit-slider-runnable-track {
          background: rgba(99, 102, 241, 0.3);
        }
        .custom-slider::-webkit-slider-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -5px;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
          transition: transform 0.1s;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
      `}} />

      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden text-center p-6 sm:p-10 relative flex flex-col items-center">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/15 blur-[60px] rounded-full pointer-events-none" />

        {/* Top Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5 shadow-sm border border-indigo-100 dark:border-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
        </div>

        <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">Review Audio</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Playback your capture before submitting it for deep AI analysis.</p>

        {/* ── CUSTOM AUDIO PLAYER UI ── */}
        <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 mb-8 border border-slate-200/60 dark:border-slate-800 shadow-inner">
          {audioUrl ? (
            <>
              {/* Hidden Native Audio Element */}
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden" 
              />
              
              {/* Progress Bar & Timestamps */}
              <div className="flex flex-col mb-4">
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={handleSeek}
                  className="custom-slider mb-2"
                  style={{
                    background: `linear-gradient(to right, #6366f1 ${(currentTime / duration) * 100}%, transparent ${(currentTime / duration) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-6">
                {/* Skip Back 10s */}
                <button onClick={() => skipTime(-10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><text x="10" y="16" fontSize="8" fontWeight="bold">10</text></svg>
                </button>

                {/* Play/Pause */}
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-transform active:scale-90">
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                </button>

                {/* Skip Forward 10s */}
                <button onClick={() => skipTime(10)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><text x="10" y="16" fontSize="8" fontWeight="bold">10</text></svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
               <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
               <div className="text-xs text-slate-400 font-mono">Loading media payload...</div>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS (MOBILE RESPONSIVE FIXED) ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <button 
            onClick={onDiscard}
            className="w-full sm:flex-1 py-4 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Discard
          </button>
          
          <button 
            onClick={onGenerate}
            className="w-full sm:flex-1 py-4 rounded-xl font-black uppercase tracking-wider text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            Generate Notes
          </button>
        </div>
      </div>
      
    </div>
  );
}
