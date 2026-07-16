/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.1 Mobile Scrolling Hotfix for Audio Record.
 * 1. Viewport Scroll Fix: Ripped out the restrictive `overflow-hidden` class from the master container. This allows the component to grow naturally and the browser to scroll down smoothly on smaller screens without clipping the bottom buttons.
 * ================================================================================================
 * 🎙️ JEMER ACADEMY DESIGN SYSTEM — AUDIO RECORD ENGINE (v2.1)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AudioRecord({ onCapture, onOpenHistory }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);

  // Handle Recording Timer with Pause Support
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording, isPaused]);

  // Format seconds into MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  // Start Hardware Microphone
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        // Only process the blob if we are not actively cancelling
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          onCapture({ url: audioUrl, name: `Live Recording - ${new Date().toLocaleTimeString()}`, size: audioBlob.size });
        }
        
        // Stop all hardware tracks to release the microphone
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setRecordingTime(0);
        setIsPaused(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error("[AUDIO HARDWARE FAULT] Microphone access denied:", err);
      alert("Please allow microphone permissions to record audio.");
    }
  };

  // Stop Hardware Microphone (Finishes and generates blob)
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Pause Hardware Microphone
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Resume Hardware Microphone
  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // Cancel Hardware Microphone (Trashes recording)
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = []; // Empty chunks so onstop ignores it
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  // Handle Device File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dispatch directly to the Review stage
    const audioUrl = URL.createObjectURL(file);
    onCapture({ url: audioUrl, name: file.name, size: file.size });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    // 🚀 THE FIX: Removed overflow-hidden from this container so it scales naturally
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between items-center relative animate-fade-in p-6 lg:p-12 bg-slate-50 dark:bg-[#0A0A0A] rounded-[2rem] shadow-inner">
      
      {/* 🚀 CSS INJECTION: Custom Waveforms & Orb Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes wave-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .orb-glow { animation: orb-float 6s ease-in-out infinite; }
        .wave-line {
          width: 3px;
          border-radius: 99px;
          background: linear-gradient(to top, #3b82f6, #8b5cf6, #d946ef);
          transform-origin: center;
          animation: wave-pulse 1.2s ease-in-out infinite;
        }
        @media (min-width: 640px) { .wave-line { width: 4px; } }
      `}} />

      {/* ── TOP SECTION: TEXT HEADERS ── */}
      <div className="text-center w-full max-w-md z-10 pt-4">
        {isRecording ? (
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2 flex items-center justify-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}></span>
              {isPaused ? "Recording Paused" : "Capturing your audio..."}
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug">
              Record, process, and manage your audio with a single tap
            </p>
          </>
        ) : (
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2">
              Ready to capture your voice?
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug">
              Choose your recording type and begin your session instantly.
            </p>
          </>
        )}
      </div>

      {/* ── MIDDLE SECTION: DYNAMIC GRAPHICS & TIMER ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-8">
        
        {!isRecording ? (
          /* IDLE STATE: Premium Glowing Orb */
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center orb-glow">
            {/* Outer blur mesh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/40 via-blue-500/30 to-purple-600/40 rounded-full blur-[60px] mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
            {/* Inner dense core */}
            <div className="absolute inset-8 bg-gradient-to-bl from-indigo-500/50 via-purple-500/40 to-pink-500/40 rounded-full blur-[40px] mix-blend-multiply dark:mix-blend-screen"></div>
            {/* Structural wireframe lines simulating 3D mesh (simplified for CSS) */}
            <div className="absolute inset-16 border border-blue-400/20 dark:border-blue-400/10 rounded-full rotate-45"></div>
            <div className="absolute inset-16 border border-purple-400/20 dark:border-purple-400/10 rounded-full -rotate-45"></div>
            <div className="absolute inset-20 border border-cyan-400/20 dark:border-cyan-400/10 rounded-full rotate-90"></div>
          </div>
        ) : (
          /* ACTIVE STATE: Waveform & Timer */
          <div className="flex flex-col items-center justify-center w-full">
            {/* Audio Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-32 sm:h-40 w-full mb-8">
              {Array.from({ length: 25 }).map((_, i) => {
                // Generate a pseudo-random height and animation delay for a dynamic look
                const height = 20 + Math.random() * 80;
                const delay = Math.random() * 1.2;
                return (
                  <div 
                    key={i} 
                    className="wave-line" 
                    style={{ 
                      height: `${height}%`, 
                      animationDelay: `${delay}s`,
                      animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                  />
                );
              })}
            </div>

            {/* Large Digital Timer */}
            <div className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-md">
              {formatTime(recordingTime)}
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM SECTION: ACTION CONTROLS ── */}
      <div className="w-full max-w-md flex items-end justify-between z-10 px-4 pb-4">
        
        {!isRecording ? (
          /* IDLE CONTROLS */
          <>
            {/* Left Action: Upload File */}
            <label className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="audio/*" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </label>

            {/* Center Action: Master Record Button */}
            <div className="flex flex-col items-center gap-3 group">
              <button
                onClick={startRecording}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-purple-500/30 group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <div className="w-full h-full bg-slate-50 dark:bg-[#0A0A0A] rounded-full flex items-center justify-center">
                  <div className="w-[85%] h-[85%] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </div>
                </div>
              </button>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Record Now</span>
            </div>

            {/* Right Action: Open History */}
            <button 
              onClick={onOpenHistory}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            </button>
          </>
        ) : (
          /* ACTIVE RECORDING CONTROLS */
          <>
            {/* Left Action: Cancel/Discard */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={cancelRecording}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-500 transition-all active:scale-95 shadow-sm"
              >
                <span className="font-mono text-sm font-bold">00</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Cancel</span>
            </div>

            {/* Center Action: Stop Recording */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={stopRecording}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-xl shadow-purple-500/40 transition-all duration-300 active:scale-95"
              >
                <div className="w-full h-full bg-slate-50 dark:bg-[#0A0A0A] rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-inner"></div>
                </div>
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Stop Recording</span>
            </div>

            {/* Right Action: Pause/Resume */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500 transition-all active:scale-95 shadow-sm"
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="lucide lucide-play translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                )}
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">{isPaused ? "Resume" : "Pause"}</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}