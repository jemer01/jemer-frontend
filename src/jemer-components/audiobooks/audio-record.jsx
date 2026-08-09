/**
 * [NEW] 
 * SUMMARY: Phase 1 UI/UX Recording Engine Upgrade
 * 1. Animation Bug Fix: The waveform jump issue was caused by `Math.random()` re-rendering every 1 second when the timer ticked. Replaced with a `useMemo` block so the bars are generated once and animate purely via smooth CSS transitions.
 * 2. 500MB Size Limit UI: Updated strict byte logic to `523239424` (499MB). Replaced `alert()` with a stunning custom CSS overlay modal.
 * 3. Live Record Auto-Stop Logic: Tracks byte size actively during recording via `ondataavailable`. If it hits 499MB, it stops automatically, saves the audio, and shows the modal beautifully.
 * 4. Strict Logic Preservation: Maintained media recorder flow, refs, and cleanup processes.
 * ================================================================================================
 * 🎙️ JEMER ACADEMY DESIGN SYSTEM — AUDIO RECORD ENGINE (v3.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export default function AudioRecord({ onCapture, onOpenHistory }) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // 🚀 [NEW] Custom Modal State for Error Handling
  const [sizeErrorModal, setSizeErrorModal] = useState({ isOpen: false, title: "", message: "" });
  
  // ==========================================
  // REFS
  // ==========================================
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const streamRef = useRef(null);
  
  // 🚀 [NEW] Real-time Byte Tracker
  const currentBytesRef = useRef(0);
  const limitTriggeredRef = useRef(false);

  // 499MB Strict Guard Limit in Bytes
  const MAX_FILE_SIZE_BYTES = 523239424; 

  // ==========================================
  // 🚀 [NEW] UI WAVEFORM MEMOIZATION
  // Fixes the issue where bars changed size every second on re-render
  // ==========================================
  const waveBars = useMemo(() => {
    return Array.from({ length: 25 }).map(() => ({
      height: 20 + Math.random() * 80,
      delay: Math.random() * 1.2
    }));
  }, []); // Empty dependency array means this only computes once per mount

  // ==========================================
  // SIDE EFFECTS
  // ==========================================
  
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

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  // ==========================================
  // CORE RECORDING LOGIC
  // ==========================================

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      currentBytesRef.current = 0;
      limitTriggeredRef.current = false;

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          currentBytesRef.current += e.data.size;

          // 🚀 [NEW] Real-Time Auto-Stop Logic if Limit is Reached
          if (currentBytesRef.current > MAX_FILE_SIZE_BYTES && !limitTriggeredRef.current) {
             limitTriggeredRef.current = true;
             setSizeErrorModal({
               isOpen: true,
               title: "Storage Limit Reached",
               message: "You've hit the 500MB max capacity. We automatically stopped and saved the recording up to this point."
             });
             
             // Stopping it will automatically trigger the onstop event which handles the saving
             if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
               mediaRecorderRef.current.stop();
               setIsRecording(false);
             }
          }
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Double check block for manual stop edge cases. We do NOT discard it, we process it.
          if (audioBlob.size > MAX_FILE_SIZE_BYTES && !limitTriggeredRef.current) {
            setSizeErrorModal({
               isOpen: true,
               title: "Recording Ended",
               message: "Recording reached the 500MB max limit and has been saved."
            });
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          onCapture({ blob: audioBlob, url: audioUrl, name: `Live Recording - ${new Date().toLocaleTimeString()}`, size: audioBlob.size });
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        setRecordingTime(0);
        setIsPaused(false);
      };

      mediaRecorderRef.current.start(1000); // 🚀 [NEW] Capture data every 1 second to enforce accurate real-time limit checking
      
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      console.error("[AUDIO HARDWARE FAULT] Microphone access denied:", err);
      alert("Please allow microphone permissions to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = []; 
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🚀 [NEW] Beautiful CSS Modal trigger instead of ugly alert
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSizeErrorModal({
         isOpen: true,
         title: "File Too Large",
         message: "The selected file exceeds the 500MB limit. Please select a smaller audio file to continue."
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    onCapture({ blob: file, url: audioUrl, name: file.name, size: file.size });
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ==========================================
  // UI RENDER BLOCK
  // ==========================================
  
  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between items-center relative animate-fade-in p-6 lg:p-12">
      
      {/* 🚀 CSS INJECTION */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes orb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orb-reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        /* 🚀 [NEW] Smoother Fluid Wave Animation */
        @keyframes fluid-wave-pulse {
          0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .orb-float { animation: orb-float 6s ease-in-out infinite; }
        .orb-spin-slow { animation: orb-spin 15s linear infinite; }
        .orb-spin-fast { animation: orb-reverse-spin 8s linear infinite; }
        .core-pulse { animation: core-pulse 3s ease-in-out infinite; }
        
        .wave-line {
          width: 4px;
          border-radius: 99px;
          background: linear-gradient(to top, #6366f1, #a855f7, #ec4899);
          transform-origin: center;
          /* Apply smooth ease-in-out for fluid equalizer feel */
          animation: fluid-wave-pulse 1.4s ease-in-out infinite;
          transition: height 0.3s ease;
        }
        @media (min-width: 640px) { .wave-line { width: 5px; } }
      `}} />

      {/* 🚀 [NEW] CUSTOM CSS OVERLAY MODAL */}
      {sizeErrorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative transform transition-all animate-scale-in">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{sizeErrorModal.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              {sizeErrorModal.message}
            </p>
            <button 
              onClick={() => setSizeErrorModal({ isOpen: false, title: "", message: "" })}
              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-transform"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── TOP SECTION ── */}
      <div className="text-center w-full max-w-md z-10 pt-4">
        {isRecording ? (
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2 flex items-center justify-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${isPaused ? "bg-amber-500" : "bg-red-500 animate-pulse shadow-red-500/50"}`}></span>
              {isPaused ? "Recording Paused" : "Capturing your audio..."}
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug transition-colors">
              Speak clearly into your microphone
            </p>
          </>
        ) : (
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2">
              Ready to capture your voice?
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug transition-colors">
              Upload a file or start recording instantly.
            </p>
          </>
        )}
      </div>

      {/* ── MIDDLE SECTION ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-8">
        
        {!isRecording ? (
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center orb-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-full blur-[60px] core-pulse"></div>
            <div className="absolute inset-4 border-[2px] border-dashed border-indigo-400/30 dark:border-indigo-500/40 rounded-full orb-spin-slow"></div>
            <div className="absolute inset-8 border border-purple-400/40 dark:border-purple-500/50 rounded-full orb-spin-fast blur-[1px]"></div>
            <div className="absolute inset-12 border-t-2 border-r-2 border-cyan-400/60 dark:border-cyan-400/80 rounded-full orb-spin-slow shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
            <div className="absolute inset-16 bg-gradient-to-bl from-indigo-500/60 via-purple-500/50 to-pink-500/50 rounded-full blur-[25px] core-pulse"></div>
            <div className="absolute inset-24 bg-gradient-to-tr from-cyan-300 via-blue-500 to-purple-400 rounded-full blur-[15px] core-pulse opacity-80"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            {/* 🚀 [NEW] Stable, Memoized Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-32 sm:h-40 w-full mb-8">
              {waveBars.map((bar, i) => (
                  <div 
                    key={i} 
                    className="wave-line" 
                    style={{ 
                      height: `${bar.height}%`, 
                      animationDelay: `${bar.delay}s`,
                      animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                  />
              ))}
            </div>

            <div className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-lg transition-colors tabular-nums">
              {formatTime(recordingTime)}
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM SECTION ── */}
      <div className="w-full max-w-md flex items-end justify-between z-10 px-4 pb-4">
        
        {!isRecording ? (
          <>
            <label className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all active:scale-95 group">
              <input type="file" ref={fileInputRef} accept="audio/*" className="hidden" onChange={handleFileUpload} />
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </label>

            <div className="flex flex-col items-center gap-3 group">
              <button
                onClick={startRecording}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1.5 shadow-[0_0_40px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] group-hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors shadow-inner">
                  <div className="w-[85%] h-[85%] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </div>
                </div>
              </button>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Record Now</span>
            </div>

            <button 
              onClick={onOpenHistory}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-500 transition-all active:scale-95 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            </button>
          </>
        ) : (
          <>
           <div className="flex flex-col items-center gap-3">
  <button 
    onClick={cancelRecording}
    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all active:scale-95"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  </button>
  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trash</span>
</div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={stopRecording}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[10px] shadow-inner transform transition-transform hover:scale-90"></div>
                </div>
              </button>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Finish</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all active:scale-95"
              >
                {isPaused ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                )}
              </button>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{isPaused ? "Resume" : "Pause"}</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
