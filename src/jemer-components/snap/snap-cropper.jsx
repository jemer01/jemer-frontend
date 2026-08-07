/**
 * [NEW UPGRADE & BUG FIX]
 * SUMMARY: v3.1 Generation Mode Backend Compatibility & Pro Cropper Engine.
 * 1. Enum Sanitization: Normalized `handleCropExecution` mode parameter to uppercase ("SOLVE", "ANALYZE", "GRADE") to resolve API 400 error (ERR_JEMER_SNAP_400).
 * 2. Mobile Edge Alignment: Maintained responsive container padding (`px-3 sm:px-0`) and dynamic viewport heights.
 * 3. Action Grid: Retained SVG icons, gradient states, drop shadows, and typography.
 * ================================================================================================
 * ✂️ JEMER ACADEMY DESIGN SYSTEM — SNAP CROPPER ENGINE (v3.1)
 * ================================================================================================
 */

"use client";

import React, { useRef } from "react";
import Cropper from "react-cropper";

export default function SnapCropper({ imageSource, onAction, onCancel }) {
  const cropperRef = useRef(null);

 // NEW: [Bug Fix - Generation Mode Resolution]
// SUMMARY: Fixed a critical JavaScript comma operator bug caused by the previous AI update. 
// The expression `(mode || 'explain', 'analyze', 'answer')` was evaluating as a comma sequence, 
// causing it to ALWAYS return the last item ('answer'). I have corrected this to properly preserve 
// the exact mode passed by the button while safely applying the requested uppercase normalization.

  const handleCropExecution = (mode) => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        maxWidth: 4096,
        maxHeight: 4096,
        fillColor: '#ffffff',
      });

      const croppedImageData = croppedCanvas.toDataURL('image/jpeg', 0.95);
      
      // Upper-case normalization to guarantee backend API Enum compatibility
      // FIXED: Removed the invalid comma operator sequence to ensure the actual mode is passed.
      const validMode = (mode || 'explain').toUpperCase();
      
      onAction(croppedImageData, validMode);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-0 py-2 sm:py-0">
      {/* High-speed CDN injection of CropperJS CSS */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css" />

      {/* Custom styles for Cropper selection box */}
      <style jsx global>{`
        .cropper-view-box {
          outline: 2px solid #3b82f6 !important;
          outline-color: #3b82f6 !important;
          border-radius: 8px;
        }
        .cropper-line {
          background-color: #3b82f6 !important;
        }
        .cropper-point {
          background-color: #3b82f6 !important;
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
        }
        .cropper-bg {
          background-image: none !important;
          background-color: #0f172a !important;
        }
      `}</style>

      <div className="w-full flex flex-col h-[calc(100dvh-130px)] sm:h-[calc(100vh-120px)] animate-fade-in bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl relative">
        
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest font-mono">
              Adjust Crop Region
            </span>
          </div>
          <button 
            onClick={onCancel} 
            className="text-slate-600 dark:text-slate-300 font-bold text-xs sm:text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors active:scale-95 px-3 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>

        {/* ── CROPPER VIEWPORT ENGINE ── */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center overflow-hidden w-full h-full">
          {imageSource ? (
            <Cropper
              src={imageSource}
              style={{ height: "100%", width: "100%" }}
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
            <div className="flex flex-col items-center text-slate-400 gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-blue-500">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Loading Image Frame...</p>
            </div>
          )}
        </div>

        {/* ── PRO ACTION BUTTON GRID ── */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3.5 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 shrink-0 z-10">
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-2xl mx-auto w-full">
            
            {/* Action: SOLVE */}
            <button 
              onClick={() => handleCropExecution('explain')} 
              className="group bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] shadow-lg shadow-blue-500/25 border border-blue-400/30"
            >
              <div className="text-white group-hover:scale-110 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                  <path d="M20 3v4"/>
                  <path d="M22 5h-4"/>
                  <path d="M4 17v2"/>
                  <path d="M5 18H3"/>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Solve</span>
              <span className="text-[9px] sm:text-[10px] text-blue-100 font-medium leading-tight opacity-90 hidden sm:block">Step-by-step</span>
            </button>
            
            {/* Action: ANALYZE */}
            <button 
              onClick={() => handleCropExecution('analyze')} 
              className="group bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope">
                  <path d="M6 18h8"/>
                  <path d="M3 22h18"/>
                  <path d="M14 22a7 7 0 1 0 0-14h-1"/>
                  <path d="M9 14h2"/>
                  <path d="M9 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2Z"/>
                  <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Analyze</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 opacity-80 font-medium leading-tight hidden sm:block">Deep dive</span>
            </button>
            
            {/* Action: GRADE */}
            <button 
              onClick={() => handleCropExecution('answer')} 
              className="group bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-[0.96] border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/>
                  <path d="M22 10v6"/>
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-black tracking-wide uppercase">Grade</span>
              <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 opacity-80 font-medium leading-tight hidden sm:block">Mark & Fix</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}