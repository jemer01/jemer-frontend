/**
 * [NEW UPGRADE]
 * SUMMARY: Refined Dark Mode Depth Lighting & Ambient Glow Dynamics (v2.1)
 * 1. Dark Mode Depth Refinement: Softened container shadows (`dark:shadow-xl dark:shadow-black/40`) and adjusted background surfaces (`dark:bg-slate-900`) to create a smooth, readable dark interface.
 * 2. Ambient Orb Optimization: Reduced dark mode background orb opacity (`dark:bg-red-500/10`, `dark:bg-purple-500/10`) to eliminate harsh glare and keep container text super crisp.
 * 3. Light Mode & Mobile Stack Integrity: Kept light mode styles intact along with mobile layout reordering (`order-2 lg:order-1` and `order-1 lg:order-2`).
 * ================================================================================================
 * 💎 JEMER ACADEMY DESIGN SYSTEM — PREMIUM LEARNING TOOLS GRID INTERFACE (v2.1)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution in Next.js to enable interactive hover physics, scaling, and routing

// Import Core React library for UI component rendering
import React from "react"; 

// Import Next.js Link component for client-side routing
import Link from "next/link"; 

/**
 * ToolsWidgets Component
 * Renders the master tool selection grid containing Vid2Notes, Audiobooks Transcriber, and Snap to Answer.
 */
export default function ToolsWidgets() {
  return (
    // 🏛️ MASTER GRID MATRIX CONTAINER: 12-column grid on desktop screens, single vertical column on mobile devices
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full pb-8">
      
      {/* ────────────────────────────────────────────────────────────────────────────────────────
          LEFT COLUMN: MEDIA PROCESSING UTILITIES (VID2NOTES & AUDIOBOOKS)
          Mobile Order Fix: 'order-2' puts this below Snap on mobile, 'lg:order-1' restores desktop left column positioning
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-5 flex flex-col gap-6 w-full h-full order-2 lg:order-1">
        
        {/* ── WIDGET CARD 1: VID2NOTES ENGINE ── */}
        <Link 
          // Target page route for YouTube video transcript note generator
          href="/vid2notes"
          // Outer Card Container: Styled with subtle dark mode borders and controlled ambient depth
          className="group relative w-full flex-1 min-h-[240px] rounded-[28px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/95 backdrop-blur-xl border border-slate-300 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/60 dark:shadow-xl dark:shadow-black/40 hover:shadow-2xl dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer ring-1 ring-white/50 dark:ring-white/5"
        >
          {/* 🆕 REFINED AMBIENT GLOWING ORB: Softened dark mode background glow opacity to prevent lighting glare */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/10 dark:bg-red-500/10 rounded-full blur-3xl group-hover:scale-125 group-hover:bg-red-500/15 transition-all duration-700 pointer-events-none" />

          {/* Card Main Content Header Stack */}
          <div className="z-10 flex flex-col items-start gap-4">
            {/* Custom SVG Container Badge for Vid2Notes */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
              {/* Play / Video Document Icon */}
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Title & Description Typography Stack */}
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Vid<span className="text-red-500">2</span>Notes
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-[90%]">
                Paste any YouTube link. We extract the transcript, synthesize the core concepts, and generate structured study guides instantly.
              </p>
            </div>
          </div>
          
          {/* Interactive Action Arrow Indicator (Fades in smoothly on user hover) */}
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-red-500 group-hover:border-red-500 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>

        {/* ── WIDGET CARD 2: AUDIO BOOKS PROCESSING ── */}
        <Link 
          // Target page route for Audiobooks and speech transcription engine
          href="/audiobooks"
          // Outer Card Container
          className="group relative w-full flex-1 min-h-[240px] rounded-[28px] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/95 backdrop-blur-xl border border-slate-300 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/60 dark:shadow-xl dark:shadow-black/40 hover:shadow-2xl dark:hover:border-slate-700 active:scale-[0.98] cursor-pointer ring-1 ring-white/50 dark:ring-white/5"
        >
          {/* 🆕 REFINED AMBIENT GLOWING ORB: Softened dark mode background glow opacity to prevent lighting glare */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl group-hover:scale-125 group-hover:bg-purple-500/15 transition-all duration-700 pointer-events-none" />

          {/* Card Main Content Header Stack */}
          <div className="z-10 flex flex-col items-start gap-4">
            {/* Custom SVG Container Badge for Audio Books */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
              {/* Microphone / Audio Wave Icon */}
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            
            {/* Title & Description Typography Stack */}
            <div className="space-y-1.5">
              <h3 className="text-xl lg:text-2xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                Audio Book <span className="text-purple-500">Transcriber</span>
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-[90%]">
                Upload device audio files. Our AI processes speech patterns to generate accurate transcripts and highlight key learning moments.
              </p>
            </div>
          </div>

          {/* Interactive Action Arrow Indicator (Fades in smoothly on user hover) */}
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-400 group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shadow-md">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────────────────────
          RIGHT COLUMN: MASSIVE "SNAP TO ANSWER" DROP ZONE ENGINE
          Mobile Order Fix: 'order-1' forces this to the top on mobile screens, 'lg:order-2' restores desktop right position
         ──────────────────────────────────────────────────────────────────────────────────────── */}
      <div className="col-span-1 lg:col-span-7 flex h-full min-h-[420px] lg:min-h-[500px] order-1 lg:order-2">
        <Link 
          // Target page route for AI Vision Camera Scanner
          href="/snap"
          // Main Dropzone Container: Styled with dashed borders and adjusted dark depth
          className="group relative w-full h-full rounded-[32px] bg-white dark:bg-slate-900 border-2 border-dashed border-blue-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-500 shadow-2xl shadow-blue-900/10 dark:shadow-2xl dark:shadow-black/50 active:scale-[0.98] cursor-pointer flex flex-col items-center justify-center text-center p-8 overflow-hidden z-10"
        >
          {/* Background Gradient Base Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/90 dark:from-slate-900 dark:to-slate-950 pointer-events-none -z-10" />
          
          {/* 🆕 REFINED RADIAL GLOW OVERLAY: Softened radial blue depth light in dark mode for clean focus */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none -z-10 transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
          
          {/* 🎯 CAMERA RETICLE CORNERS: Decorative frame brackets */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-tl-xl transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-tr-xl transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-bl-xl transition-all duration-500 group-hover:-translate-x-1 group-hover:translate-y-1" />
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-slate-300 dark:border-slate-700 group-hover:border-blue-500 rounded-br-xl transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />

          {/* Core Dropzone Interactive Content Stack */}
          <div className="z-10 flex flex-col items-center max-w-md gap-6">
            
            {/* Scanner Center Badge Icon Container */}
            <div className="relative w-28 h-28 rounded-[2rem] bg-white dark:bg-slate-800 shadow-2xl shadow-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 ease-out border border-white/50 dark:border-slate-700">
              {/* Animated scanning laser beam overlay effect */}
              <div className="absolute inset-x-0 top-0 h-1 bg-blue-400/50 blur-sm w-full shadow-[0_0_15px_rgba(59,130,246,0.9)] animate-[scan_2.5s_ease-in-out_infinite]" />
              
              {/* Camera Vision Scanner SVG Icon */}
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            {/* Title & Description Stack */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Snap to Answer
              </h2>
              <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed px-4">
                Encountered a complex equation or a confusing diagram? Snap a photo of your screen or textbook. Our computer vision AI will decode the logic instantly.
              </p>
            </div>

            {/* Action Call-to-Action Pill Button */}
            <div className="mt-4 px-8 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black tracking-wider uppercase rounded-full text-xs shadow-xl shadow-slate-900/20 dark:shadow-white/10 group-hover:shadow-2xl transition-all duration-300 flex items-center gap-3">
              <span>Open Camera</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

          </div>

          {/* Embedded Custom CSS Animation for the Scanner Laser Line */}
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
};