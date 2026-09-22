"use client";

/**
 * ================================================================================================
 * 📺 JEMERPLAY — MEDIA PLAYER VIEW COMPONENT (v3.0.0)
 * ================================================================================================
 * [NEW UPGRADE — v3.0.0]
 * SUMMARY: Intelligent Fallback Rails & Mobile Edge-to-Edge Fluidity
 * 1. RELATED VIDEOS FALLBACK: Implemented a `Map` merge between `searchResults` and `watchHistory`.
 *    If a user enters the player via their watch history, the related videos rail dynamically 
 *    populates from their past history instead of rendering completely blank. Duplicates are stripped.
 * 2. MOBILE EDGE-TO-EDGE: Forced the player to stretch 100% full-bleed on mobile screens by removing 
 *    padding and borders, while preserving the premium rounded `max-h-[70vh]` aesthetic on desktop.
 * 3. ACTION PURGE: Maintained the distraction-free environment. No Like/Subscribe buttons, keeping 
 *    the focus purely on educational content.
 * ================================================================================================
 */

import React from "react";
// Importing the shared scrollable rail logic we exported from the Home view
import { HorizontalVideoList } from "./jemerplay-home"; 

export default function JemerPlayMediaPlayer({ video, goHome, onVideoSelect, searchResults, watchHistory }) {
  if (!video) return null;

  // 🚀 FIXED: Intelligent Related Videos Merge
  // Combines active search results and user watch history to guarantee the rail is never empty.
  // Uses a Map to instantly filter out duplicates and the currently playing video.
  const allAvailableVideos = [...(searchResults || []), ...(watchHistory || [])];
  const uniqueVideosMap = new Map();
  
  allAvailableVideos.forEach((v) => {
    const videoId = v.youtube_id || v.id;
    const currentActiveId = video.youtube_id || video.id;
    
    if (videoId && videoId !== currentActiveId && !uniqueVideosMap.has(videoId)) {
      uniqueVideosMap.set(videoId, v);
    }
  });
  
  const relatedVideos = Array.from(uniqueVideosMap.values());

  return (
    // Outer container: padding removed on mobile (sm:px-4) to allow the player to stretch edge-to-edge
    <div className="w-full max-w-7xl mx-auto sm:px-4 py-2 sm:py-4 animate-fade-in">
      
      {/* ── RETURN CONTROL ── */}
      <div className="px-4 sm:px-0">
        <button 
          onClick={goHome} 
          className="mb-3 sm:mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit p-2 -ml-2 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Library
        </button>
      </div>

      {/* ── IMMERSIVE THEATER MODE PLAYER ── */}
      {/* 🚀 FIXED: Mobile edge-to-edge (no rounded corners on small screens), and strict vertical max-height (max-h-[65vh] lg:max-h-[70vh]) on desktop */}
      <div className="w-full aspect-video max-h-[65vh] lg:max-h-[70vh] bg-black sm:rounded-2xl md:rounded-[2rem] overflow-hidden relative shadow-2xl ring-0 sm:ring-1 ring-white/10 border-y sm:border border-slate-800 group mx-auto flex items-center justify-center">
        
        {/* Official YouTube IFrame Player with strict boundary parameters */}
        <iframe
          src={`https://www.youtube.com/embed/${video.youtube_id || video.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&fs=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        ></iframe>

      </div>

      {/* ── VIDEO METADATA ── */}
      <div className="mt-5 sm:mt-6 flex flex-col gap-4 pb-8 sm:pb-10 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-0">
        
        <div>
          {/* Widened and scaled text to fit perfectly without squishing */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-slate-900 dark:text-white mb-3 sm:mb-4 tracking-tight leading-snug">
            {video.title}
          </h1>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md ring-2 ring-white dark:ring-slate-900 shrink-0">
              {video.channel ? video.channel.charAt(0) : "J"}
            </div>
            
            <div className="flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{video.channel}</h3>
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-slate-500">{video.views} Views</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── BOTTOM RE-ENTRY POINT ── */}
      {/* 🚀 FIXED: Injects the smartly merged relatedVideos array so users can always chain-watch */}
      {relatedVideos.length > 0 && (
        <div className="pt-6 sm:pt-8">
          <HorizontalVideoList title="More related videos" videos={relatedVideos} onSelect={onVideoSelect} />
        </div>
      )}
      
    </div>
  );
}