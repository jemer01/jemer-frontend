/**
 * ================================================================================================
 * 📺 JEMERPLAY — SEARCH RESULTS VIEW COMPONENT (UPGRADED HEADER & CLEAN YOUTUBE LIST)
 * ================================================================================================
 * NEW UPGRADES:
 * 1. Removed category filter tabs/pills per user instruction.
 * 2. Upgraded and polished the top header section (back button, search query title, lecture count, and pulse indicator) with premium styling to eliminate empty space and enhance the UI.
 * 3. Maintained rich data population and mobile-first YouTube style edge-to-edge horizontal list layout.
 */

"use client";

import React from "react";

export default function JemerPlaySearchResults({ searchQuery, goHome, onVideoSelect, dummyVideos }) {
  // Expanded rich dummy database payload for robust search
  const baseVideos = dummyVideos && dummyVideos.length > 0 ? dummyVideos : [
    { id: "1", title: "Introduction to React Next.js Architecture", channel: "Jemer Code", duration: "14:20", views: "1.2M", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80" },
    { id: "2", title: "Advanced Quantum Mechanics Simplified", channel: "Science Academy", duration: "45:00", views: "340K", thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80" },
    { id: "3", title: "The History of Ancient Civilizations", channel: "History Daily", duration: "22:15", views: "890K", thumbnail: "https://images.unsplash.com/photo-1518991669955-9c7e78ec80ca?w=800&q=80" },
    { id: "4", title: "Understanding Graph Data Structures", channel: "Dev Mastery", duration: "18:45", views: "2.1M", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" },
    { id: "5", title: "Mastering Tailwind CSS Grids & Flexbox", channel: "UI Wizards", duration: "30:10", views: "450K", thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80" },
    { id: "6", title: "Calculus Derivatives & Integrals Masterclass", channel: "Math Genius", duration: "52:40", views: "980K", thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80" },
    { id: "7", title: "Building Fullstack Apps with Neon DB", channel: "Jemer Code", duration: "28:30", views: "650K", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80" },
    { id: "8", title: "Astrophysics and Black Holes Explained", channel: "Science Academy", duration: "38:12", views: "1.5M", thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80" },
  ];

  // Filter videos based strictly on search query
  const filteredVideos = baseVideos.filter(video => {
    return (
      video.title.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      video.channel.toLowerCase().includes((searchQuery || "").toLowerCase())
    );
  });

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
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Search Results</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Results for "{searchQuery || "All Lectures"}"
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              {filteredVideos.length} educational lectures available
            </p>
          </div>
        </div>
      </div>

      {/* YouTube Mobile Format: Edge-to-edge horizontal list without individual card containers */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-1 sm:gap-4 w-full">
        {filteredVideos.map((video) => (
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
                <span>2 days ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
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