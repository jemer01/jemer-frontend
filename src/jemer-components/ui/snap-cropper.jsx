/**
 * [NEW UPGRADE]
 * SUMMARY: Executed Build Error Fix - CSS Resolution Bypass.
 * 1. Module Not Found Fix: Removed the local `import "cropperjs/dist/cropper.css"` which was causing the Next.js Turbopack build to crash due to missing node_modules paths.
 * 2. CDN Injection: Surgically injected the official CropperJS CSS directly via a high-speed CDN `<link>` tag inside the component. This makes the file 100% plug-and-play and bulletproof against npm dependency routing errors.
 * ================================================================================================
 * ✂️ JEMER ACADEMY DESIGN SYSTEM — SNAP CROPPER ENGINE (v2.1)
 * ================================================================================================
 */

"use client"; // Enforces client-side execution for browser APIs

import React, { useRef } from "react";
// Imports the official React wrapper for the cropping engine
// (Removed the local CSS import that was breaking the Next.js build)
import Cropper from "react-cropper";

export default function SnapCropper({ imageSource, onAction, onCancel }) {
  // Reference to the active cropper instance to extract canvas data
  const cropperRef = useRef(null);

  /**
   * Captures the exact boundaries the user selected, generates a high-quality 
   * image string, and routes it to the orchestrator based on the chosen mode.
   */
  const handleCropExecution = (mode) => {
    if (cropperRef.current && cropperRef.current.cropper) {
      // Extract the targeted region at maximum quality to ensure the AI can read complex math/text
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#ffffff', // Prevents transparent backgrounds from turning black in JPEGs
      });

      // Convert to a pristine base64 string
      const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 0.95);
      
      // Dispatch payload up to page.js
      onAction(croppedImageData, mode);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl relative">
      
      {/* 🚀 THE FIX: High-speed CDN injection of the required CSS to bypass node_modules build errors */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css" />

      {/* ── HEADER ── */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-10 shrink-0">
        <span className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest font-mono">
          Adjust Frame
        </span>
        <button 
          onClick={onCancel} 
          className="text-slate-900 dark:text-white font-bold text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95"
        >
          Cancel
        </button>
      </div>

      {/* ── CROPPER VIEWPORT ENGINE ── */}
      <div className="flex-1 bg-slate-200/50 dark:bg-black/80 relative flex items-center justify-center overflow-hidden w-full h-full">
        {imageSource ? (
          <Cropper
            src={imageSource}
            style={{ height: "100%", width: "100%" }}
            // Configuration optimized for document/equation scanning
            initialAspectRatio={NaN} 
            guides={true}
            viewMode={1}
            background={false}
            autoCropArea={0.85}
            checkOrientation={false}
            ref={cropperRef}
            className="w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <i className="fas fa-spinner fa-spin text-3xl mb-2"></i>
            <p className="text-xs font-mono uppercase tracking-widest">Loading Image Data...</p>
          </div>
        )}
      </div>

      {/* ── HIGH-END iOS ACTION GRID ── */}
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 shrink-0 z-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto w-full">
          
          {/* Action: SOLVE */}
          <button 
            onClick={() => handleCropExecution('solve')} 
            className="group bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 sm:p-4 rounded-[1.25rem] flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 border border-blue-400/30"
          >
              <i className="fas fa-brain text-xl sm:text-2xl mb-1 drop-shadow-md group-hover:scale-110 transition-transform"></i>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Solve</span>
              <span className="text-[9px] sm:text-[10px] text-blue-100 font-medium leading-tight opacity-90 hidden sm:block">Step-by-step</span>
          </button>
          
          {/* Action: ANALYZE */}
          <button 
            onClick={() => handleCropExecution('analyze')} 
            className="group bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-white p-3 sm:p-4 rounded-[1.25rem] flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-300/50 dark:border-slate-700 hover:border-teal-500/50 dark:hover:border-teal-500/50"
          >
              <i className="fas fa-microscope text-xl sm:text-2xl text-teal-600 dark:text-teal-400 mb-1 drop-shadow-sm group-hover:scale-110 transition-transform"></i>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Analyze</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 opacity-60 font-medium leading-tight group-hover:opacity-100 transition-opacity hidden sm:block">Deep dive</span>
          </button>
          
          {/* Action: GRADE */}
          <button 
            onClick={() => handleCropExecution('grade')} 
            className="group bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-800 dark:text-white p-3 sm:p-4 rounded-[1.25rem] flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-300/50 dark:border-slate-700 hover:border-pink-500/50 dark:hover:border-pink-500/50"
          >
              <i className="fas fa-marker text-xl sm:text-2xl text-pink-600 dark:text-pink-400 mb-1 drop-shadow-sm group-hover:scale-110 transition-transform"></i>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Grade</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 opacity-60 font-medium leading-tight group-hover:opacity-100 transition-opacity hidden sm:block">Mark & Fix</span>
          </button>

        </div>
      </div>

    </div>
  );
}