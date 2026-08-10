/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 Live Backend Integration & Skeleton Loading.
 * 1. Live Data Injection: Replaced `dummyVideos` and local filtering with the live `searchResults` array pushed down from `page.js`.
 * 2. Skeleton Loader: Added a sleek `isSearching` condition that renders a pulsing UI matching the exact dimensions of the video cards while the Go backend executes the pgvector search.
 * 3. Preserved UI: Maintained 100% of the mobile-first edge-to-edge layout, typography, and SVG assets without breaking a single design rule.
 * ================================================================================================
 * 📺 JEMERPLAY — SEARCH RESULTS VIEW COMPONENT (v2.0)
 * ================================================================================================
 */

"use client";

import React from "react";

export default function JemerPlaySearchResults({ searchQuery, goHome, onVideoSelect, searchResults, isSearching }) {
  
  // 🚀 FIXED: We now safely default to the live searchResults array instead of local dummy filtering
  const displayVideos = searchResults || [];

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-0 sm:px-6 py-4 sm:py-6 pb-16">
      
      {/* Upgraded Top Header Section with Polished Back Button & Status Card */}
      <div className="flex items-center justify-between mb-6 px-3 sm:px-2 bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={goHome}
            className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-all shadow-sm active:scale-95 border border-slate-200 dark:border-slate-700"
            aria-label="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`w-2 h-2 rounded-full bg-blue-600 ${isSearching ? 'animate-ping' : 'animate-pulse'}`}></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                {isSearching ? 'Searching Database...' : 'Search Results'}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Results for "{searchQuery || "All Lectures"}"
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {isSearching ? 'Analyzing semantic vectors...' : `${displayVideos.length} educational lectures available`}
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 NEW: Skeleton Loader State for active AI Searching */}
      {isSearching ? (
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 sm:gap-4 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex flex-row items-start gap-3 sm:gap-4 px-3 sm:p-3 py-2.5 w-full bg-transparent border-b sm:border-b-0 border-slate-100 dark:border-slate-800/60">
              <div className="relative shrink-0 w-[148px] sm:w-[180px] lg:w-[220px] aspect-video rounded-xl sm:rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shadow-sm" />
              <div className="flex flex-col flex-1 gap-2.5 pt-1 pr-1 w-full">
                <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                <div className="w-1/3 h-3 bg-slate-200 dark:bg-slate-800 rounded mt-2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* YouTube Mobile Format: Edge-to-edge horizontal list without individual card containers */
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 sm:gap-4 w-full">
          {displayVideos.map((video) => (
            <div 
              key={video.id} 
              onClick={() => onVideoSelect(video)}
              className="group cursor-pointer flex flex-row items-start gap-3 sm:gap-4 px-3 sm:p-3 py-2.5 w-full bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/50 sm:rounded-2xl transition-colors border-b sm:border-b-0 border-slate-100 dark:border-slate-800/60"
            >
              {/* Thumbnail Container */}
              <div className="relative shrink-0 w-[148px] sm:w-[180px] lg:w-[220px] aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white text-[9px] sm:text-[10px] font-black tracking-widest rounded backdrop-blur-sm">
                  {video.duration}
                </div>
              </div>

              {/* Video Metadata & Details Extended Horizontally */}
              <div className="flex flex-col flex-1 min-w-0 justify-start py-0.5 pr-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm lg:text-base line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 truncate">
                  {video.channel}
                </p>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                  <span>{video.views} views</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  {/* We can hardcode 'Recently Cached' or map a real date here if backend supports it */}
                  <span>Recently Cached</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State Fallback */}
      {!isSearching && displayVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No lectures found</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6">We couldn't find anything matching your search query. Try checking your spelling or searching for another topic.</p>
          <button 
            onClick={goHome}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            Back to Explore
          </button>
        </div>
      )}

    </div>
  );
}
