/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v1.0 YouTube IFrame Compliance & Rendering.
 * 1. Player Integration: Completely replaced the dummy image and scrim with an official YouTube `<iframe>`.
 * 2. Loophole Styling: Injected `modestbranding=1`, `rel=0`, and `showinfo=0` to strip external YouTube branding and keep users trapped strictly in Jemer Academy's educational ecosystem.
 * 3. Architecture Preservation: The surrounding metadata wrappers, channel metrics, and border styling remain completely untouched.
 * ================================================================================================
 * 📺 JEMERPLAY — MEDIA PLAYER VIEW COMPONENT
 * ================================================================================================
 */

"use client";

import React from "react";
// Importing the shared scrollable rail logic we exported from the Home view
import { HorizontalVideoList } from "./jemerplay-home"; 

export default function JemerPlayMediaPlayer({ video, goHome, onVideoSelect, dummyVideos }) {
  if (!video) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 animate-fade-in">
      
      {/* ── RETURN CONTROL ── */}
      <button 
        onClick={goHome} 
        className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-fit p-2 -ml-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Library
      </button>

      {/* ── IMMERSIVE THEATER MODE PLAYER ── */}
      <div className="w-full aspect-video bg-black rounded-2xl md:rounded-[2rem] overflow-hidden relative shadow-2xl ring-1 ring-white/10 border border-slate-800 group">
        
        {/* 🚀 FIXED: Official YouTube IFrame Player with strict boundary parameters */}
        <iframe
          src={`https://www.youtube.com/embed/${video.youtube_id || video.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&fs=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        ></iframe>

      </div>

      {/* ── VIDEO METADATA & ACTIONS ── */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-10 border-b border-slate-200 dark:border-slate-800/80">
        
        {/* Left Side: Channel Logic */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {video.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white dark:ring-slate-900">
              {video.channel ? video.channel.charAt(0) : "J"}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{video.channel}</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">{video.views} Views</p>
            </div>
            <button className="ml-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
        
        {/* Right Side: Theme-Aware Social Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {/* Like/Dislike Dual Button */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shrink-0">
            <button className="flex items-center gap-2 px-5 py-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700/80">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Like</span>
            </button>
            <button className="px-5 py-2.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
            </button>
          </div>
          
          {/* Share Button */}
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
        </div>
      </div>

      {/* ── BOTTOM RE-ENTRY POINT ── */}
      <div className="pt-8">
        <HorizontalVideoList title="More from this Topic" videos={dummyVideos} onSelect={onVideoSelect} />
      </div>
    </div>
  );
}
