/**
 * [NEW UPGRADE]
 * SUMMARY: Executed v2.0 UI/UX Masterpiece Overhaul.
 * 1. Mobile Reordering: Implemented 'order-2 lg:order-1' & 'order-1 lg:order-2' so Snap to Answer renders at the absolute top on mobile devices.
 * 2. Light Mode Visibility Fix: Added severe 'border-slate-300', heavy 'shadow-xl shadow-slate-200/60', and solid gradient backgrounds ('from-white to-slate-50') so containers pop intensely on light mode.
 * 3. Premium Depth & Glows: Injected absolute positioned radial blur blobs behind the containers to give a physical, glowing Apple iOS aesthetic.
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — PREMIUM LEARNING TOOLS GRID INTERFACE (v2.0)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution to allow for hover states and interactive routing

import React from "react"; // Core React library
import Link from "next/link"; // Next.js optimized routing bridge for instant page swaps

export default function ToolsWidgets() {
  return (
    // 🏛️ MASTER GRID MATRIX CONTAINER
    // Desktop: 12-column asymmetrical grid. Mobile/Tablet: Single column vertical stack.
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pb-8">
      
      {/* ── LEFT COLUMN: MEDIA PROCESSING UTILITIES (VID2NOTES & AUDIOBOOKS) ── */}
      {/* ORDER FIX: 'order-2' on mobile forces this below Snap. 'lg:order-1' puts it back on the left for desktop. */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 w-full h-full order-2 lg:order-1">
        
        {/* WIDGET CARD 1: VID2NOTES ENGINE */}
        <Link 
          href="/vid2notes"
          className="group relative w-full flex-1 min-h-[240px] rounded-[28px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 backdrop-blur-xl border border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/60 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-2xl active:scale-[0.98] cursor-pointer ring-1 ring-white/50 dark:ring-white/5 inset-0"
        >
          {/* Ambient Glowing Orb Background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 dark:bg-red-500/20 rounded-full blur-3xl group-hover:scale-125 group-hover:bg-red-500/15 transition-all duration-700 pointer-events-none"></div>

          {/* Card Header Content */}
          <div className="z-10 flex flex-col items-start gap-4">
            {/* 🛑 CUSTOM SVG INJECTION ZONE: Add your exact size/design SVG here */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
              {/* */}
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">Vid<span className="text-red-500">2</span>Notes</h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-[90%]">
                Paste any YouTube link. We extract the transcript, synthesize the core concepts, and generate structured study guides instantly.
              </p>
            </div>
          </div>
          
          {/* Interactive Arrow Indicator fading in on hover */}
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </Link>

        {/* WIDGET CARD 2: AUDIO BOOKS PROCESSING */}
        <Link 
          href="/audiobooks"
          className="group relative w-full flex-1 min-h-[240px] rounded-[28px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 backdrop-blur-xl border border-slate-300 dark:border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/60 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] hover:shadow-2xl active:scale-[0.98] cursor-pointer ring-1 ring-white/50 dark:ring-white/5 inset-0"
        >
          {/* Ambient Glowing Orb Background */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl group-hover:scale-125 group-hover:bg-purple-500/15 transition-all duration-700 pointer-events-none"></div>

          {/* Card Header Content */}
          <div className="z-10 flex flex-col items-start gap-4">
             {/* 🛑 CUSTOM SVG INJECTION ZONE: Add your exact size/design SVG here */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
              {/* */}
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">Audio Book <span className="text-purple-500">Transcriber</span></h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-[90%]">
                Upload device audio files. Our AI processes speech patterns to generate accurate transcripts and highlight key learning moments.
              </p>
            </div>
          </div>

          {/* Interactive Arrow Indicator fading in on hover */}
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </Link>
      </div>

      {/* ── RIGHT COLUMN: MASSIVE "SNAP TO ANSWER" DROP ZONE ENGINE ── */}
      {/* ORDER FIX: 'order-1' forces this to the top of the stack on mobile. 'lg:order-2' puts it back on the right for desktop. */}
      <div className="col-span-1 lg:col-span-7 flex h-full min-h-[420px] lg:min-h-[500px] order-1 lg:order-2">
        <Link 
          href="/snap"
          className="group relative w-full h-full rounded-[32px] bg-white dark:bg-slate-900 border-2 border-dashed border-blue-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-500 shadow-2xl shadow-blue-900/10 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center text-center p-8 overflow-hidden z-10"
        >
          {/* High-End Ambient Background Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/90 dark:from-slate-900 dark:to-slate-950 pointer-events-none -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none -z-10 transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
          
          {/* 🎯 CAMERA RETICLE CORNERS */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-tl-xl transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-tr-xl transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-bl-xl transition-all duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-br-xl transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />

          {/* Core Content Stack */}
          <div className="z-10 flex flex-col items-center max-w-md gap-6">
            
            {/* 🛑 CUSTOM SVG INJECTION ZONE: Floating Scanner Icon */}
            <div className="relative w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl shadow-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 ease-out border border-white/50 dark:border-slate-700">
              {/* Animated scanning line overlay effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-blue-400/50 blur-sm w-full shadow-[0_0_15px_rgba(59,130,246,0.9)] animate-[scan_2.5s_ease-in-out_infinite]" />
              
              {/* */}
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Snap to Answer
              </h2>
              <p className="text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                Encountered a complex equation or a confusing diagram? Snap a photo of your screen or textbook. Our computer vision AI will decode the logic instantly.
              </p>
            </div>

            {/* Premium Action Button */}
            <div className="mt-4 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black tracking-wider uppercase rounded-full text-xs shadow-xl shadow-slate-900/20 dark:shadow-white/10 group-hover:shadow-2xl transition-all duration-300 flex items-center gap-3">
              <span>Open Camera</span>
              <i className="fas fa-arrow-right text-[10px]" />
            </div>

          </div>

          {/* Embedded Custom Tailwind Animation for the Scanner Line */}
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