/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.3 Premium Orb Physics & Seamless Theme Integration.
 * 1. Root Theme Fix: Completely stripped the `bg-slate-50`, `dark:bg-slate-900`, `rounded-[2rem]`, and `shadow-inner` classes from the master container. This eliminates the "card" effect and edge-clipping, allowing the component to seamlessly inherit the exact global background color used in the Audio Results page.
 * 2. Advanced 3D Orb Mechanics: Upgraded the idle state orb into a complex UI element. Injected custom CSS keyframes (`orb-spin-slow`, `orb-spin-fast`, `core-pulse`) to create counter-rotating rings, dynamic shadows, and a multi-layered pulsating energy core that feels premium and highly interactive.
 * 3. Component Integrity: Preserved all core recording logic, state management, and functional UI elements strictly without breaking any existing features.
 * ================================================================================================
 * 🎙️ JEMER ACADEMY DESIGN SYSTEM — AUDIO RECORD ENGINE (v2.3)
 * ================================================================================================
 */

"use client"; // Marks this file as a Client Component in Next.js, allowing the use of React hooks

// Importing necessary React hooks for state management and component lifecycle
import React, { useState, useEffect, useRef } from "react";

// Main default export function for the AudioRecord component
// Accepts two props: onCapture (handles the finalized audio data) and onOpenHistory (opens user's previous recordings)
export default function AudioRecord({ onCapture, onOpenHistory }) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // State to track if the microphone is currently active and recording
  const [isRecording, setIsRecording] = useState(false);
  
  // State to track if the active recording is temporarily paused
  const [isPaused, setIsPaused] = useState(false);
  
  // State to track the total duration of the current recording in seconds
  const [recordingTime, setRecordingTime] = useState(0);
  
  // ==========================================
  // REFS FOR MUTABLE VALUES (No re-renders)
  // ==========================================
  
  // Ref to target the hidden file input element for manual uploads
  const fileInputRef = useRef(null);
  
  // Ref to hold the active MediaRecorder instance controlling the hardware microphone
  const mediaRecorderRef = useRef(null);
  
  // Ref to accumulate chunks of audio data as they are recorded
  const audioChunksRef = useRef([]);
  
  // Ref to store the setInterval ID so we can clear the timer when paused or stopped
  const timerIntervalRef = useRef(null);
  
  // Ref to hold the active media stream so we can shut down the hardware tracks later
  const streamRef = useRef(null);

  // ==========================================
  // SIDE EFFECTS (Timer Logic)
  // ==========================================
  
  // useEffect hook to manage the digital timer while recording
  useEffect(() => {
    // If we are actively recording and NOT paused, start the clock
    if (isRecording && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        // Increment the recording time by 1 every 1000ms (1 second)
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      // If paused or stopped, clear the interval to stop the clock
      clearInterval(timerIntervalRef.current);
    }
    
    // Cleanup function: clears the interval if the component unmounts to prevent memory leaks
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording, isPaused]); // Re-run this effect only when recording or paused states change

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  
  // Function to format the raw seconds integer into a human-readable digital clock string (MM:SS or HH:MM:SS)
  const formatTime = (seconds) => {
    // Calculate hours, pad with leading zero if needed
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    // Calculate minutes, pad with leading zero if needed
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    // Calculate remaining seconds, pad with leading zero
    const s = (seconds % 60).toString().padStart(2, "0");
    // Return HH:MM:SS if hours exist, otherwise just MM:SS
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  // ==========================================
  // CORE RECORDING LOGIC
  // ==========================================

  // Async function to request microphone access and begin recording
  const startRecording = async () => {
    try {
      // Request access to the user's audio hardware
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Store the stream in our ref
      streamRef.current = stream;
      
      // Initialize a new MediaRecorder instance with the granted audio stream
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Reset the audio chunks array to prepare for a fresh recording
      audioChunksRef.current = [];

      // Event listener: Fires periodically as data becomes available from the mic
      mediaRecorderRef.current.ondataavailable = (e) => {
        // If the chunk has data, push it into our array ref
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      // Event listener: Fires when the recording is fully stopped
      mediaRecorderRef.current.onstop = () => {
        // Check if we actually have audio data (prevents errors on cancel)
        if (audioChunksRef.current.length > 0) {
          // Compile all audio chunks into a single Blob (WebM format)
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // Create a temporary local URL for the Blob so we can play it back
          const audioUrl = URL.createObjectURL(audioBlob);
          // Pass the generated URL, a timestamped name, and the file size up to the parent component
          onCapture({ url: audioUrl, name: `Live Recording - ${new Date().toLocaleTimeString()}`, size: audioBlob.size });
        }
        
        // Loop through all hardware tracks in the stream and force them to stop (turns off mic light)
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        // Reset our timer and pause states for the next session
        setRecordingTime(0);
        setIsPaused(false);
      };

      // Physically start capturing audio
      mediaRecorderRef.current.start();
      
      // Update UI states to reflect active recording
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      // Error handling if the user denies microphone permissions
      console.error("[AUDIO HARDWARE FAULT] Microphone access denied:", err);
      alert("Please allow microphone permissions to record audio.");
    }
  };

  // Function to manually stop an active recording (triggers onstop event above)
  const stopRecording = () => {
    // Only stop if the recorder exists and is currently recording
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Function to temporarily pause an active recording
  const pauseRecording = () => {
    // Only pause if the recorder exists, is recording, and is NOT already paused
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };

  // Function to resume a paused recording
  const resumeRecording = () => {
    // Only resume if the recorder exists, is recording, and IS currently paused
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  // Function to cancel and trash an active recording without saving it
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Empty the chunks array *before* stopping, so the onstop function ignores it
      audioChunksRef.current = []; 
      // Stop the hardware
      mediaRecorderRef.current.stop();
      // Reset all UI states back to idle
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
    }
  };

  // Function to handle manual file selection from the user's device
  const handleFileUpload = (e) => {
    // Grab the first file from the input event
    const file = e.target.files[0];
    // If no file was selected (user hit cancel), abort
    if (!file) return;

    // Create a local URL for the selected file
    const audioUrl = URL.createObjectURL(file);
    // Dispatch the file data directly to the parent component for review
    onCapture({ url: audioUrl, name: file.name, size: file.size });
    
    // Reset the file input value so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ==========================================
  // UI RENDER BLOCK
  // ==========================================
  
  return (
    // 🚀 THE FIX: Removed `bg-slate-50`, `dark:bg-slate-900`, and `rounded-[2rem]` entirely.
    // The container is now transparent, inheriting the exact global root background from your app seamlessly.
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between items-center relative animate-fade-in p-6 lg:p-12">
      
      {/* 🚀 CSS INJECTION: Advanced Multi-layered Animations for the Energy Orb & Waveform */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Gentle vertical hover for the entire orb assembly */
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        /* Smooth, slow forward rotation for outer containment rings */
        @keyframes orb-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Faster reverse rotation for inner rings to create mechanical depth */
        @keyframes orb-reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        /* Deep, breathing pulse for the inner plasma cores */
        @keyframes core-pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        /* Up and down scaling for the active audio waveform visualizer */
        @keyframes wave-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        /* Utility classes mapping to the defined keyframes */
        .orb-float { animation: orb-float 6s ease-in-out infinite; }
        .orb-spin-slow { animation: orb-spin 15s linear infinite; }
        .orb-spin-fast { animation: orb-reverse-spin 8s linear infinite; }
        .core-pulse { animation: core-pulse 3s ease-in-out infinite; }
        
        .wave-line {
          width: 3px;
          border-radius: 99px;
          background: linear-gradient(to top, #3b82f6, #8b5cf6, #d946ef);
          transform-origin: center;
          animation: wave-pulse 1.2s ease-in-out infinite;
        }
        @media (min-width: 640px) { .wave-line { width: 4px; } }
      `}} />

      {/* ── TOP SECTION: DYNAMIC TEXT HEADERS ── */}
      <div className="text-center w-full max-w-md z-10 pt-4">
        {isRecording ? (
          /* Text shown when ACTIVE or PAUSED */
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2 flex items-center justify-center gap-2">
              {/* Status Indicator Dot: Amber for paused, pulsing Red for active recording */}
              <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-500" : "bg-red-500 animate-pulse"}`}></span>
              {isPaused ? "Recording Paused" : "Capturing your audio..."}
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug transition-colors">
              Record, process, and manage your audio with a single tap
            </p>
          </>
        ) : (
          /* Text shown when IDLE */
          <>
            <h2 className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 tracking-wide mb-2">
              Ready to capture your voice?
            </h2>
            <p className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white leading-snug transition-colors">
              Choose your recording type and begin your session instantly.
            </p>
          </>
        )}
      </div>

      {/* ── MIDDLE SECTION: DYNAMIC VISUAL GRAPHICS & TIMER ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-8">
        
        {!isRecording ? (
          /* 🚀 UPGRADED IDLE STATE GRAPHIC: Premium Multi-layered 3D Energy Orb */
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center orb-float">
            {/* Layer 1: Massive outer atmospheric glow (slowly breathing) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-full blur-[60px] core-pulse"></div>
            
            {/* Layer 2: Slow spinning dashed outer containment ring */}
            <div className="absolute inset-4 border-[2px] border-dashed border-indigo-400/30 dark:border-indigo-500/40 rounded-full orb-spin-slow"></div>
            
            {/* Layer 3: Fast reverse-spinning solid barrier with a slight blur */}
            <div className="absolute inset-8 border border-purple-400/40 dark:border-purple-500/50 rounded-full orb-spin-fast blur-[1px]"></div>
            
            {/* Layer 4: High-energy partial arc ring with heavy box-shadow glow (creates depth) */}
            <div className="absolute inset-12 border-t-2 border-r-2 border-cyan-400/60 dark:border-cyan-400/80 rounded-full orb-spin-slow shadow-[0_0_20px_rgba(34,211,238,0.4)]"></div>
            
            {/* Layer 5: Dense, pulsing inner plasma core */}
            <div className="absolute inset-16 bg-gradient-to-bl from-indigo-500/60 via-purple-500/50 to-pink-500/50 rounded-full blur-[25px] core-pulse"></div>
            
            {/* Layer 6: Absolute center bright singularity */}
            <div className="absolute inset-24 bg-gradient-to-tr from-cyan-300 via-blue-500 to-purple-400 rounded-full blur-[15px] core-pulse opacity-80"></div>
          </div>
        ) : (
          /* ACTIVE STATE GRAPHIC: Animated Audio Waveform & Digital Timer */
          <div className="flex flex-col items-center justify-center w-full">
            {/* Wrapper for the individual waveform bars */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 h-32 sm:h-40 w-full mb-8">
              {/* Map out 25 individual div elements to create the visualizer */}
              {Array.from({ length: 25 }).map((_, i) => {
                // Generate a pseudo-random baseline height for organic variance
                const height = 20 + Math.random() * 80;
                // Generate a pseudo-random animation delay so they don't pulse in unison
                const delay = Math.random() * 1.2;
                return (
                  <div 
                    key={i} 
                    className="wave-line" 
                    style={{ 
                      height: `${height}%`, // Apply the randomized height
                      animationDelay: `${delay}s`, // Apply the randomized delay
                      // Pause the CSS animation immediately if the user pauses the recording
                      animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                  />
                );
              })}
            </div>

            {/* Massive Digital Timer Display */}
            <div className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-slate-800 dark:text-white drop-shadow-lg transition-colors">
              {/* Call our helper function to format the raw seconds */}
              {formatTime(recordingTime)}
            </div>
          </div>
        )}

      </div>

      {/* ── BOTTOM SECTION: ACTION CONTROLS & BUTTONS ── */}
      <div className="w-full max-w-md flex items-end justify-between z-10 px-4 pb-4">
        
        {!isRecording ? (
          /* IDLE CONTROLS (Upload, Record, History) */
          <>
            {/* Left Action Button: Manual File Upload */}
            <label className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-lg transition-all active:scale-95 shadow-sm">
              {/* Hidden file input element that triggers the file browser */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="audio/*" // Only allow audio files
                className="hidden" 
                onChange={handleFileUpload} 
              />
              {/* Upload Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </label>

            {/* Center Action Button: Master Record Trigger */}
            <div className="flex flex-col items-center gap-3 group">
              <button
                onClick={startRecording}
                // Group hover effects scale the button and increase the glowing shadow
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-purple-500/30 group-hover:shadow-purple-500/60 group-hover:scale-105 transition-all duration-300 active:scale-95"
              >
                {/* Inner background matches the dark theme naturally by using transparency or specific dark class */}
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
                  {/* The central colored pill containing the microphone icon */}
                  <div className="w-[85%] h-[85%] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="lucide lucide-mic"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                  </div>
                </div>
              </button>
              {/* Helper text label below the main button */}
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Record Now</span>
            </div>

            {/* Right Action Button: Open Audio History */}
            <button 
              onClick={onOpenHistory}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-lg transition-all active:scale-95 shadow-sm"
            >
              {/* Library/History Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-library"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            </button>
          </>
        ) : (
          /* ACTIVE RECORDING CONTROLS (Cancel, Stop, Pause/Resume) */
          <>
            {/* Left Action Button: Cancel/Discard Recording */}
            <div className="flex flex-col items-center gap-2">
              <button 
                onClick={cancelRecording}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all active:scale-95 shadow-sm"
              >
                {/* 00 icon representing a reset/trash action */}
                <span className="font-mono text-sm font-bold">00</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Cancel</span>
            </div>

            {/* Center Action Button: Stop and Save Recording */}
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={stopRecording}
                // Pulsing outer shadow to draw attention to the stop action
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 transition-all duration-300 active:scale-95"
              >
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
                  {/* A rounded square icon universally recognized as the 'Stop' symbol */}
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-inner"></div>
                </div>
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">Stop Recording</span>
            </div>

            {/* Right Action Button: Pause / Resume Toggle */}
            <div className="flex flex-col items-center gap-2">
              <button 
                // Toggle between resume and pause functions based on current state
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10 transition-all active:scale-95 shadow-sm"
              >
                {isPaused ? (
                  // Play Icon (Resume) - Translating x slightly to visually center the triangle
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="lucide lucide-play translate-x-0.5"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                ) : (
                  // Plus/Pause Icon (Pause)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                )}
              </button>
              {/* Dynamic text depending on whether the system is paused */}
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">{isPaused ? "Resume" : "Pause"}</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}