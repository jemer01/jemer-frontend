/**
 * [NEW UPGRADE]
 * SUMMARY: v2.3 Snap Card Ergonomic Refactor & Typographic Alignment
 * 1. LEFT-AXIS ALIGNMENT: Repositioned the "Snap to Answer" content flow from a constrained center-aligned layout to a strict left-aligned (`items-start text-left`) axis. This completely eliminates text squishing and ragged edges on slim mobile phones.
 * 2. STRUCTURAL CONSISTENCY: Matches the exact visual rhythm of the JemerPlay and Audiobooks cards. The icon, title, paragraph, and button now flow "straight down" vertically.
 * 3. SPATIAL INSET: Increased the container padding (`p-10 lg:p-14`) so the left-aligned content sits perfectly inside the decorative corner brackets without overlapping.
 * ================================================================================================
 * [PREVIOUS UPGRADE]
 * SUMMARY: v2.2 Manifesto UI/UX Refactor for Tools Widgets
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — PREMIUM LEARNING TOOLS GRID INTERFACE (v2.3)
 * ================================================================================================
 */

"use client";

import React from "react";
import Link from "next/link";

export default function ToolsWidgets() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pb-8">
      
      {/* LEFT COLUMN: MEDIA PROCESSING UTILITIES (VID2NOTES & AUDIOBOOKS) */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 w-full h-full order-2 lg:order-1">
         
         {/* WIDGET CARD 1: JEMERPLAY MEDIA PLATFORM */}
        <Link 
          href="/jemerplay"
          className="group relative w-full flex-1 min-h-[240px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer"
        >
          {/* Card Main Content Header Stack */}
          <div className="z-10 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Jemer<span className="text-red-600 dark:text-red-500">Play</span>
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-[90%]">
                Search and explore thousands of educational video lectures. Watch natively in theater-mode and build your own library with our advanced semantic vector cache.
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* WIDGET CARD 2: AUDIO BOOKS PROCESSING */}
        <Link 
          href="/audiobooks"
          className="group relative w-full flex-1 min-h-[240px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer"
        >
          <div className="z-10 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Audio Book <span className="text-purple-600 dark:text-purple-400">Transcriber</span>
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-[90%]">
                Upload device audio files. Our AI processes speech patterns to generate accurate transcripts and highlight key learning moments.
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-purple-600 group-hover:border-purple-600 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>

      {/* RIGHT COLUMN: MASSIVE "SNAP TO ANSWER" DROP ZONE ENGINE */}
      <div className="col-span-1 lg:col-span-7 flex h-full min-h-[420px] lg:min-h-[500px] order-1 lg:order-2">
        <Link 
          href="/snap"
          className="group relative w-full h-full rounded-3xl bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer flex flex-col items-start justify-center text-left p-10 lg:p-14 overflow-hidden z-10"
        >
          {/* Decorative frame brackets */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-600 rounded-tl-xl transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
          <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-600 rounded-tr-xl transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-600 rounded-bl-xl transition-all duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />
          <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-600 rounded-br-xl transition-all duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />

          {/* 🚀 FIXED: Inner container strictly left-aligned, matching the flow of the left-hand column cards */}
          <div className="z-10 flex flex-col items-start w-full max-w-xl gap-6">
            
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300 shrink-0">
              <div className="absolute inset-x-0 top-0 h-1 bg-blue-500/40 blur-xs w-full shadow-sm animate-[scan_2.5s_ease-in-out_infinite]" />
              
              <svg className="w-10 h-10 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                Snap to Answer
              </h2>
              <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                Encountered a complex equation or a confusing diagram? Snap a photo of your screen or textbook. Our computer vision AI will decode the logic instantly.
              </p>
            </div>

            <div className="mt-2 sm:mt-4 px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold tracking-wider uppercase rounded-full text-[11px] sm:text-xs shadow-sm transition-all flex items-center gap-3">
              <span>Open Camera</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scan {
              0% { top: 10%; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 90%; opacity: 0; }
            }
          `}} />
        </Link>
      </div>

    </div>
  );
}