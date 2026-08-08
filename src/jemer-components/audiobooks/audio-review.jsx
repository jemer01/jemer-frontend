/**
 * [NEW]
 * SUMMARY: Fixed `createObjectURL` Overload TypeError.
 * 1. Type Validation: Added explicit `instanceof Blob || instanceof File` checking before passing `audioData` to the URL generator. This acts as a shield, ensuring only valid binary objects are processed, preventing the app from crashing if an unexpected object type is passed.
 *
 * [NEW UPGRADE & BUG FIX]
 * SUMMARY: v1.1 Audiobooks Review Matrix Playback Fix.
 * 1. Audio Playback Fix: Added dynamic type checking for `audioData`. If the audio payload is passed as a base64 string or an existing URL instead of a raw Blob, it directly assigns it to the player, safely bypassing the `createObjectURL` TypeError ("Overload resolution failed").
 * 2. Preserved UI: Maintained all animations, glowing effects, and action routing perfectly.
 * ================================================================================================
 * 🎧 JEMER ACADEMY DESIGN SYSTEM — AUDIOBOOKS REVIEW (v1.1)
 * ================================================================================================
 */

"use client";

import React, { useEffect, useState } from "react";

export default function AudioReview({ audioData, onDiscard, onGenerate }) {
  const [audioUrl, setAudioUrl] = useState(null);

  // Safely generate a browser-playable URL or use the existing string payload
  useEffect(() => {
    if (audioData) {
      // 🚀 FIXED: Check if the payload is already a base64 string or blob URL
      if (typeof audioData === "string") {
        setAudioUrl(audioData);
        return;
      }

      // 🚀 FIXED: Strictly ensure it is a Blob or File before creating an Object URL
      // This directly resolves the "Overload resolution failed" crash.
      if (audioData instanceof Blob || audioData instanceof File) {
        try {
          // If it's a raw Blob or File object, create the object URL
          const url = URL.createObjectURL(audioData);
          setAudioUrl(url);
          
          // Memory cleanup to prevent memory leaks when the component unmounts
          return () => URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Audio playback initialization failed:", error);
        }
      } else {
        console.warn("AudioReview received invalid audioData format:", audioData);
      }
    }
  }, [audioData]);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-full p-6 animate-fade-in">
      
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden text-center p-8 sm:p-12 relative">
        
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="w-20 h-20 mx-auto bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner ring-1 ring-indigo-500/20">
          <i className="fas fa-file-audio text-3xl"></i>
        </div>

        <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight mb-2">Review Audio</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">Playback your capture before submitting it for deep cognitive analysis.</p>

        {/* Native Audio Player */}
        <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 mb-8 border border-slate-100 dark:border-slate-800/80 shadow-inner">
          {audioUrl ? (
            <audio controls src={audioUrl} className="w-full custom-audio-player focus:outline-none" />
          ) : (
            <div className="text-xs text-slate-400 font-mono animate-pulse">Processing media file...</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onDiscard}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Discard
          </button>
          
          <button 
            onClick={onGenerate}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black uppercase tracking-wider text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
          >
            <i className="fas fa-magic mr-2"></i> Generate Notes
          </button>
        </div>
      </div>
      
    </div>
  );
}