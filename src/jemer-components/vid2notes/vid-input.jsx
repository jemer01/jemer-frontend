/**
 * [NEW UPGRADE]
 * SUMMARY: Fixed JSX Parsing & Build Errors in VidInput Component.
 * 1. Structural Integrity Fix: Resolved the "Unexpected token" Next.js Turbopack build error. The bug was caused by a missing closing `</div>` tag for the video thumbnail overlay (`<div className="absolute inset-0...">`).
 * 2. Tag Nesting Restored: Properly nested the play button and duration badge so the React AST (Abstract Syntax Tree) compiles correctly.
 * 3. Strict Compliance: Maintained all existing logic, tailwind classes, and states strictly as requested. Only implemented the missing geometry to ensure a successful, error-free build.
 * ================================================================================================
 * 🎥 JEMER ACADEMY DESIGN SYSTEM — VIDEO INPUT ENGINE
 * ================================================================================================
 */

"use client"; // Marks this file as a Client Component in Next.js, allowing the use of React hooks

// Importing necessary React hooks for state management and DOM reference
import React, { useState, useRef } from "react";

// Main default export function for the VidInput component
// Accepts onCapture (to send validated video data up) and onOpenHistory (to view past videos)
export default function VidInput({ onCapture, onOpenHistory }) {
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  // Tracks the raw text input from the user (the pasted URL)
  const [youtubeUrl, setYoutubeUrl] = useState("");
  // Tracks if the current URL is a valid YouTube link
  const [isValid, setIsValid] = useState(false);
  // Stores the extracted 11-character YouTube video ID
  const [videoId, setVideoId] = useState(null);
  // Stores the constructed URL for the YouTube video thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  // Tracks if the input field is currently focused (for UI styling)
  const [isFocused, setIsFocused] = useState(false);
  // Stores any error messages to display to the user
  const [errorMessage, setErrorMessage] = useState("");
  
  // Ref to directly control the HTML input element (for focusing/clearing)
  const inputRef = useRef(null);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================

  // Uses a Regular Expression (RegExp) to safely extract the 11-character video ID from various YouTube URL formats
  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    // If a match is found and the ID is exactly 11 characters, return it
    if (match && match[2].length === 11) return match[2];
    return null; // Otherwise, return null
  };

  // Validates the raw URL, extracts the ID, and updates all relevant states
  const validateAndSetUrl = (url) => {
    const trimmed = url.trim();
    // If input is empty, reset all validation states
    if (!trimmed) { 
      setIsValid(false); setVideoId(null); setThumbnail(null); setErrorMessage(""); 
      return; 
    }
    
    // Attempt to extract the ID
    const id = extractYouTubeId(trimmed);
    if (id) { 
      // If successful, set it to valid, save the ID, and construct the high-quality thumbnail URL
      setIsValid(true); 
      setVideoId(id); 
      setThumbnail(`https://img.youtube.com/vi/${id}/hqdefault.jpg`); 
      setErrorMessage(""); 
    } else { 
      // If it fails, throw an error message and reset states
      setIsValid(false); 
      setVideoId(null); 
      setThumbnail(null); 
      setErrorMessage("Please paste a valid YouTube link only"); 
    }
  };

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // Handles manual typing or pasting directly into the input field
  const handleInputChange = (e) => { 
    setYoutubeUrl(e.target.value); 
    validateAndSetUrl(e.target.value); 
  };
  
  // Reads the user's system clipboard and automatically pastes the text
  const handlePasteFromClipboard = async () => { 
    try { 
      const text = await navigator.clipboard.readText(); 
      setYoutubeUrl(text); 
      validateAndSetUrl(text); 
      inputRef.current?.focus(); 
    } catch { 
      // Fallback: just focus the input if clipboard access is denied
      inputRef.current?.focus(); 
    } 
  };
  
  // Wipes the current input completely clean and resets the UI
  const handleClear = () => { 
    setYoutubeUrl(""); 
    setIsValid(false); 
    setVideoId(null); 
    setThumbnail(null); 
    setErrorMessage(""); 
    if(inputRef.current){ 
      inputRef.current.value=""; 
      inputRef.current.focus(); 
    } 
  };
  
  // Packages the valid video data and sends it to the parent component for processing
  const handleProcessVideo = () => { 
    if(isValid && videoId) {
      onCapture({ 
        url: youtubeUrl, 
        videoId, 
        thumbnail, 
        name: `YouTube Video - ${videoId}`, 
        size: 0, 
        duration: "12:34" 
      }); 
    }
  };

  // ==========================================
  // UI RENDER BLOCK
  // ==========================================

  return (
    // Master container: handles height, centering, and responsive padding
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between items-center relative animate-fade-in p-6 lg:p-12">
      
      {/* Dynamic CSS injections for the complex orb and core pulse animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes orb-float {0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-15px) scale(1.02)}}
        @keyframes orb-spin{from{transform:rotate(0deg)} to{transform:rotate(360deg)}}
        @keyframes orb-reverse-spin{from{transform:rotate(360deg)} to{transform:rotate(0deg)}}
        @keyframes core-pulse{0%,100%{transform:scale(0.95);opacity:0.7} 50%{transform:scale(1.1);opacity:1}}
       .orb-float{animation:orb-float 6s ease-in-out infinite}.orb-spin-slow{animation:orb-spin 15s linear infinite}.orb-spin-fast{animation:orb-reverse-spin 8s linear infinite}.core-pulse{animation:core-pulse 3s ease-in-out infinite}
      `}} />

      {/* ── TOP HEADER TEXT AREA ── */}
      <div className="text-center w-full max-w-md z-10 pt-4">
        {!isValid? (
          // Idle State Text
          <>
            <h2 className="text-sm font-bold text-slate-500 mb-2">Ready to transform your video?</h2>
            <p className="text-lg font-medium text-slate-800 dark:text-white">Paste a YouTube link and generate study notes instantly.</p>
          </>
        ) : (
          // Active/Valid Video State Text
          <>
            <h2 className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              YouTube video detected...
            </h2>
            <p className="text-lg font-medium text-slate-800 dark:text-white">Perfect link, ready to process</p>
          </>
        )}
      </div>

      {/* ── MIDDLE VISUALS & INPUT AREA ── */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-8 max-w-xl">
        
        {/* Main Input Field Container */}
        <div className="w-full mb-8">
          {/* Dynamic styling changes border/ring if the input is focused */}
          <div className={`relative w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border rounded-[1.5rem] flex items-center p-2 ${isFocused? "border-red-400 ring-2 ring-red-500/20" : "border-slate-200"}`}>
            
            {/* YouTube Icon Graphic on the left */}
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center ml-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 0 0 0.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            
            {/* Actual HTML Input Element */}
            <input 
              ref={inputRef} 
              value={youtubeUrl} 
              onChange={handleInputChange} 
              onFocus={()=>setIsFocused(true)} 
              onBlur={()=>setIsFocused(false)} 
              placeholder="Paste YouTube link here..." 
              className="flex-1 bg-transparent border-none focus:outline-none px-3 py-3 text-sm truncate" 
            />
            
            {/* Conditional Clear Button (Shows only if there is text) */}
            {youtubeUrl && (
              <button onClick={handleClear} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            )}
            
            {/* Conditional Success Checkmark (Shows only if the link is a valid YouTube URL) */}
            {isValid && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white mr-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
          </div>
          
          {/* Error Message Display Area */}
          {errorMessage && <p className="text- font-bold text-red-500 mt-2 ml-2">{errorMessage}</p>}
        </div>

        {/* Dynamic Graphic Display (Idle Orb vs Active Thumbnail) */}
        {!isValid? (
          /* IDLE STATE: Animated YouTube/Red Themed Orb */
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center orb-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-400/20 via-rose-500/20 to-pink-600/20 rounded-full blur- core-pulse"></div>
            <div className="absolute inset-4 border- border-dashed border-red-400/30 rounded-full orb-spin-slow"></div>
            <div className="absolute inset-8 border border-rose-400/40 rounded-full orb-spin-fast"></div>
            <div className="absolute inset-12 border-t-2 border-r-2 border-red-400/60 rounded-full orb-spin-slow"></div>
            <div className="absolute inset-16 bg-gradient-to-bl from-red-500/60 via-rose-500/50 to-pink-500/50 rounded-full blur- core-pulse"></div>
            <div className="relative z-10 w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#ef4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0.502 6.186C0 8.07 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
          </div>
        ) : (
          /* ACTIVE STATE: Display the extracted YouTube Thumbnail */
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-full max-w-sm aspect-video rounded-[1.5rem] overflow-hidden bg-slate-900 shadow-2xl border-4 border-white dark:border-slate-800">
              
              {/* Fetched high-quality YouTube thumbnail */}
              <img src={thumbnail} alt="thumb" className="w-full h-full object-cover" />
              
              {/* Dark overlay with play button */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </div>
              </div> {/* 🚀 THE FIX: This closing div was completely missing in your original code, causing the build crash! */}
              
              {/* Hardcoded duration badge overlay */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text- font-bold px-2 py-1 rounded-md">12:34</div>
            </div>
            
            {/* Video Meta Information Display */}
            <div className="mt-4 text-center">
              <p className="text-xs font-mono font-bold text-slate-500 uppercase">Video ID: {videoId}</p>
              <p className="text-sm font-bold mt-1">Ready for AI processing</p>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM ACTION TOOLBAR ── */}
      <div className="w-full max-w-md flex items-end justify-between z-10 px-4 pb-4">
        {!isValid? (
          /* IDLE STATE TOOLBAR */
          <>
            {/* Paste from clipboard action */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={handlePasteFromClipboard} className="w-12 h-12 rounded-full border bg-white/60 backdrop-blur-xl flex items-center justify-center active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1"/></svg>
              </button>
              <span className="text- font-bold text-slate-500">Paste</span>
            </div>
            
            {/* Main Paste Link center action */}
            <div className="flex flex-col items-center gap-3">
              <button onClick={()=>inputRef.current?.focus()} className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-red-500 to-pink-600 shadow-xl active:scale-95">
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 0 0 0.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                </div>
              </button>
              <span className="text- font-bold uppercase tracking-widest text-slate-500">Paste Link</span>
            </div>
            
            {/* View video history action */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={onOpenHistory} className="w-12 h-12 rounded-full border bg-white/60 backdrop-blur-xl flex items-center justify-center active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
              </button>
              <span className="text- font-bold text-slate-500">History</span>
            </div>
          </>
        ) : (
          /* ACTIVE STATE TOOLBAR (Valid Link Detected) */
          <>
            {/* Cancel / Clear action */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={handleClear} className="w-12 h-12 rounded-full border bg-white/60 backdrop-blur-xl flex items-center justify-center active:scale-95">
                <span className="font-mono text-sm font-bold">00</span>
              </button>
              <span className="text- font-bold text-slate-500">Cancel</span>
            </div>
            
            {/* Process / Execute backend action */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={handleProcessVideo} className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 p- shadow-xl active:scale-95">
                <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </button>
              <span className="text- font-bold text-slate-500">Process Video</span>
            </div>
            
            {/* Edit current input action */}
            <div className="flex flex-col items-center gap-2">
              <button onClick={()=>inputRef.current?.focus()} className="w-12 h-12 rounded-full border bg-white/60 backdrop-blur-xl flex items-center justify-center active:scale-95">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <span className="text- font-bold text-slate-500">Edit</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}