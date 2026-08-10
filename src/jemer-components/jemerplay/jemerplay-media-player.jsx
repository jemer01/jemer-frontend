/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.2 JemerPlay Media Player & UX Overhaul.
 * 1. Mobile Edge-to-Edge: Stripped horizontal padding (`px-4`) on mobile devices specifically for the video container so it stretches fully across small screens. Ensured titles and descriptions scale perfectly without squishing.
 * 2. Widescreen Scaling Fix: Injected strict vertical ceilings (`max-h-[65vh] lg:max-h-[70vh]`) to the aspect-video container. This prevents the player from becoming too tall when the sidebar closes, allowing users to watch without scrolling down.
 * 3. Action Purge: Removed distracting social actions (Subscribe, Like, Dislike, Share) to lock users into an educational, distraction-free mindset. Re-aligned Channel and Views to look clean.
 * 4. Related Videos Integration: Replaced `dummyVideos` with the live `searchResults` array. Automatically filters out the currently playing video and pushes the remaining 19 results into the "More related videos" rail.
 * ================================================================================================
 * 📺 JEMERPLAY — MEDIA PLAYER VIEW COMPONENT (v2.2)
 * ================================================================================================
 */

"use client";

import React from "react";
// Importing the shared scrollable rail logic we exported from the Home view
import { HorizontalVideoList } from "./jemerplay-home"; 

export default function JemerPlayMediaPlayer({ video, goHome, onVideoSelect, searchResults }) {
  if (!video) return null;

  // 🚀 NEW: Filter out the active video from the live search results array to generate the 19 related videos
  const relatedVideos = (searchResults || []).filter(
    (v) => (v.youtube_id || v.id) !== (video.youtube_id || video.id)
  );

  return (
    // Outer container: padding removed on mobile (sm:px-4) to allow the player to stretch edge-to-edge
    <div className="w-full max-w-7xl mx-auto sm:px-4 py-2 sm:py-4 animate-fade-in">
      
      {/* ── RETURN CONTROL ── */}
      <div className="px-4 sm:px-0">
        <button 
          onClick={goHome} 
          className="mb-3 sm:mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit p-2 -ml-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Library
        </button>
      </div>

      {/* ── IMMERSIVE THEATER MODE PLAYER ── */}
      {/* 🚀 FIXED: Mobile edge-to-edge (no rounded corners on small screens), and strict vertical max-height (max-h-[65vh] lg:max-h-[70vh]) on desktop to prevent the player from getting too tall when sidebar closes */}
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
      {/* 🚀 FIXED: Removed social actions (Like, Share, Subscribe) and optimized mobile padding */}
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
      {/* 🚀 FIXED: Injecting the live `relatedVideos` array mapped from the active search results */}
      <div className="pt-6 sm:pt-8">
        <HorizontalVideoList title="More related videos" videos={relatedVideos} onSelect={onVideoSelect} />
      </div>
      
    </div>
  );
}
