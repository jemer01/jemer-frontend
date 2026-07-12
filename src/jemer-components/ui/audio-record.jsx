/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 Edge-to-Edge Audio Capture Engine.
 * 1. Full-Page Containerless UI: Ripped out all borders and containment boxes. The component now stretches edge-to-edge within the workspace for maximum immersion.
 * 2. Radiating Pulse Animations: Injected custom `@keyframes` to create physical, glowing ripple effects that burst from the microphone when `isRecording` is active.
 * 3. Dual-Mode Input: Handles both live microphone recording (via `navigator.mediaDevices`) and local device file uploads via a sleek dropzone/button.
 * 4. Anchored History Navigation: Elegantly placed the "Open History" routing button at the absolute bottom of the viewport.
 * ================================================================================================
 * 🎙️ JEMER ACADEMY DESIGN SYSTEM — AUDIO RECORD ENGINE (v1.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";

export default function AudioRecord({ onCapture, onOpenHistory }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start Hardware Microphone
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all hardware tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Create an object URL and dispatch to orchestrator
        const audioUrl = URL.createObjectURL(audioBlob);
        onCapture({ url: audioUrl, name: `Live Recording - ${new Date().toLocaleTimeString()}`, size: audioBlob.size });
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("[AUDIO HARDWARE FAULT] Microphone access denied:", err);
      alert("Please allow microphone permissions to record audio.");
    }
  };

  // Stop Hardware Microphone
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative animate-fade-in px-4">
      
      {/* 🚀 CSS INJECTION: Custom Ripple Animations for the Microphone */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple-1 { animation: ripple 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
        .animate-ripple-2 { animation: ripple 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; animation-delay: 0.6s; }
        .animate-ripple-3 { animation: ripple 2s cubic-bezier(0.16, 1, 0.3, 1) infinite; animation-delay: 1.2s; }
      `}} />

      {/* ── HEADER ── */}
      <div className="absolute top-8 left-0 right-0 text-center z-10">
        <h1 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Audio <span className="text-purple-600 dark:text-purple-400">Transcriber</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          Record a lecture or upload an audio file to generate instant notes.
        </p>
      </div>

      {/* ── CENTRAL MICROPHONE UI ── */}
      <div className="relative flex flex-col items-center justify-center mt-12">
        
        {/* Radiating Ripple Rings (Only visible when recording) */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-32 h-32 bg-red-500/30 rounded-full animate-ripple-1"></div>
            <div className="absolute w-32 h-32 bg-red-500/30 rounded-full animate-ripple-2"></div>
            <div className="absolute w-32 h-32 bg-red-500/30 rounded-full animate-ripple-3"></div>
          </div>
        )}

        {/* Master Microphone Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-95 group ${
            isRecording 
              ? "bg-red-500 text-white shadow-red-500/50 hover:bg-red-600" 
              : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
          }`}
        >
          {isRecording ? (
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square">
               <rect width="12" height="12" x="6" y="6" rx="2"/>
             </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          )}
        </button>

        {/* Dynamic Timer / Status Text */}
        <div className="mt-8 text-center h-8">
          {isRecording ? (
            <span className="text-2xl font-mono font-black text-red-500 dark:text-red-400 drop-shadow-sm">
              {formatTime(recordingTime)}
            </span>
          ) : (
            <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
              Tap to Record
            </span>
          )}
        </div>
      </div>

      {/* ── DEVICE UPLOAD BUTTON ── */}
      {/* Sleek, secondary action below the microphone */}
      <div className={`mt-12 transition-all duration-300 ${isRecording ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}>
        <label className="flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] cursor-pointer active:scale-95 transition-all text-slate-700 dark:text-slate-200 font-bold text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-cloud group-hover:-translate-y-1 transition-transform text-purple-500">
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
            <path d="M12 12v9"/>
            <path d="m16 16-4-4-4 4"/>
          </svg>
          <span>Upload Audio File</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="audio/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
        </label>
      </div>

      {/* ── BOTTOM ANCHOR: HISTORY BUTTON ── */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <button 
          onClick={onOpenHistory}
          className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library">
            <path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>
          </svg>
          <span>Open History</span>
        </button>
      </div>

    </div>
  );
}