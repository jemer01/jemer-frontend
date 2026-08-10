/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 JemerPlay Home History Integration.
 * 1. Live History Rail: Replaced `dummyVideos` with the live `watchHistory` prop fetched from the Postgres database.
 * 2. Conditional Rendering: The "Continue Watching" rail now completely hides itself cleanly if the user has no watch history, maintaining a flawless UI layout.
 * 3. Preserved Animations & Structure: The rotating typewriter, glow edge animations, and feature advertisement grid are 100% untouched.
 * ================================================================================================
 * 🏠 JEMERPLAY — HOME VIEW COMPONENT (v2.0)
 * ================================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";

// Array of 10 rotating typewriter placeholder texts
const PLACEHOLDER_TEXTS = [
  "Search for educational videos, topics, or lectures...",
  "Type to find mathematics and science tutorials...",
  "Looking for advanced React Next.js guides?",
  "Explore biology, chemistry, and history lessons...",
  "Find expert programming and engineering walkthroughs...",
  "Search for web development and design systems...",
  "Discover quantum mechanics and physics lectures...",
  "Type any subject to start learning instantly...",
  "Explore curated courses from top educators...",
  "What do you want to master today?"
];

export default function JemerPlayHome({ searchQuery, setSearchQuery, handleSearch, onVideoSelect, watchHistory }) {
  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── 10-TEXT ROTATING TYPEWRITER HOOK ──
  useEffect(() => {
    const currentFullText = PLACEHOLDER_TEXTS[textIndex];
    let typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(currentFullText.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex + 1 === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 1500); // Pause before deleting
        }
      } else {
        setPlaceholder(currentFullText.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % PLACEHOLDER_TEXTS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex]);

  return (
    <div className="flex flex-col gap-10 lg:gap-14 w-full max-w-7xl mx-auto pb-10">
      
      {/* ── HERO & SEARCH ENGINE ── */}
      <div className="flex flex-col items-center justify-center pt-8 lg:pt-12 px-2 sm:px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-800/50 w-fit shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
            JemerPlay Media Services
          </span>
        </div>
        
        {/* Upgraded Header: Straight line alignment for mobile & desktop */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-tight text-center mb-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span>Explore</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            JemerPlay
          </span>
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl text-center leading-relaxed mb-10 px-2">
          Your centralized hub for premium educational content.
        </p>

        {/* Search Bar Container with Expanded Mobile Width & Glow Edge Animation */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-3 px-0 sm:px-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-2 sm:px-0">
            Find your next lecture
          </label>
          <form onSubmit={handleSearch} className="w-full relative group p-[2px] rounded-[2.2rem] overflow-hidden">
            
            {/* 5-Second Multi-Color Rolling Glow Edge Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-blue-500 rounded-[2.2rem] animate-[spin_5s_linear_infinite] opacity-80 blur-[2px]" style={{ backgroundSize: '300% 300%' }}></div>
            
            <div className="relative w-full bg-white dark:bg-slate-900 rounded-[2.1rem] flex items-center">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 sm:pl-6 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors z-10">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-14 sm:pl-16 pr-28 sm:pr-32 py-4 sm:py-5 bg-transparent rounded-[2.1rem] text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2.5 bottom-2.5 px-5 sm:px-8 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] sm:text-xs rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 z-10"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── CONTINUE WATCHING RAIL ── */}
      {/* 🚀 NEW: Dynamically renders the horizontal rail ONLY if there is actual watch history data */}
      {watchHistory && watchHistory.length > 0 && (
        <HorizontalVideoList title="Continue Watching" videos={watchHistory} onSelect={onVideoSelect} />
      )}

      {/* ── FEATURE ADVERTISEMENT SECTION ── */}
      <div className="px-4 mt-6">
        <h2 className="text-xl sm:text-2xl font-black mb-6 tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 rounded-full bg-indigo-500"></span>
          How JemerPlay Works
        </h2>
        
        {/* Desktop Grid / Mobile Horizontal Swipeable Row without navigation buttons */}
        <div className="flex lg:grid lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory horizontal-premium-scroll pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
          
          {/* Ad Card 1 */}
          <div className="group relative shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start min-h-[220px] rounded-[2rem] bg-slate-900 overflow-hidden shadow-lg border border-slate-800 p-8 flex flex-col justify-end transform transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="z-10 relative">
              <h3 className="text-2xl font-display font-black text-white mb-2">1. Search Videos</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Use our intelligent search engine to instantly find the exact educational material you need from thousands of sources.
              </p>
            </div>
          </div>

          {/* Ad Card 2 */}
          <div className="group relative shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start min-h-[220px] rounded-[2rem] bg-slate-900 overflow-hidden shadow-lg border border-slate-800 p-8 flex flex-col justify-end transform transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="z-10 relative">
              <h3 className="text-2xl font-display font-black text-white mb-2">2. Pick a Video</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Browse through high-quality, curated results featuring detailed thumbnails, metadata, and accurate duration markers.
              </p>
            </div>
          </div>

          {/* Ad Card 3 (Fixed text breaking into SVG padding issue) */}
          <div className="group relative shrink-0 w-[280px] sm:w-[320px] lg:w-auto snap-start min-h-[220px] rounded-[2rem] bg-slate-900 overflow-hidden shadow-lg border border-slate-800 p-8 pt-20 lg:pt-8 flex flex-col justify-end transform transition-transform duration-300 hover:-translate-y-1.5 cursor-pointer ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="z-10 relative">
              <h3 className="text-2xl font-display font-black text-white mb-2 pr-12 lg:pr-0">3. Watch & Learn</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Immerse yourself in our distraction-free theater mode media player designed strictly to help you level up your skills.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── UTILITY: HORIZONTAL RAIL (Exported for reuse) ──
export function HorizontalVideoList({ title, videos, onSelect }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!videos || videos.length === 0) return null;

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-5 px-4">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={() => handleScroll("left")} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors shadow-sm active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => handleScroll("right")} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 transition-colors shadow-sm active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory horizontal-premium-scroll pb-6 px-4">
        {videos.map((video) => (
          <div key={video.id} onClick={() => onSelect(video)} className="group shrink-0 w-[280px] sm:w-[340px] snap-start cursor-pointer flex flex-col gap-3">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md ring-1 ring-slate-900/5 dark:ring-white/10">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-black tracking-widest rounded-md backdrop-blur-sm shadow-sm">{video.duration}</div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">{video.title}</h3>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1.5 flex items-center gap-2">
                <span>{video.channel}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{video.views}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
